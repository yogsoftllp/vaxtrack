import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { notificationService } from "./notificationService";
import { getScheduleForCountry } from "@shared/vaccinationData";
import { insertChildSchema, insertVaccinationRecordSchema, pushSubscriptions, insertLandingPageBrandingSchema, clinics } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // User preferences
  app.patch('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { notificationPreferences } = req.body;
      const user = await storage.updateUserPreferences(userId, notificationPreferences);
      res.json(user);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Children routes
  app.get('/api/children', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const childrenList = await storage.getChildren(userId);
      
      // Add stats for each child
      const childrenWithStats = await Promise.all(
        childrenList.map(async (child) => {
          const records = await storage.getVaccinationRecords(child.id);
          const today = new Date().toISOString().split('T')[0];
          
          const completed = records.filter((r) => r.status === "completed").length;
          const overdue = records.filter(
            (r) => !r.administeredDate && r.scheduledDate < today
          ).length;
          const upcoming = records.filter(
            (r) => !r.administeredDate && r.scheduledDate >= today
          ).length;
          
          return {
            ...child,
            stats: {
              total: records.length,
              completed,
              upcoming,
              overdue,
            },
          };
        })
      );
      
      res.json(childrenWithStats);
    } catch (error) {
      console.error("Error fetching children:", error);
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  app.get('/api/children/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const child = await storage.getChild(id);
      
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      
      const vaccinationRecords = await storage.getVaccinationRecords(id);
      
      res.json({
        ...child,
        vaccinationRecords,
      });
    } catch (error) {
      console.error("Error fetching child:", error);
      res.status(500).json({ message: "Failed to fetch child" });
    }
  });

  app.post('/api/children', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validatedData = insertChildSchema.parse({
        ...req.body,
        userId,
      });
      
      // Create child
      const child = await storage.createChild(validatedData);
      
      // Generate vaccination schedule based on country
      const schedule = getScheduleForCountry(child.country);
      const birthDate = new Date(child.dateOfBirth);
      
      // Create vaccination records based on schedule
      for (const vaccine of schedule) {
        const scheduledDate = new Date(birthDate);
        scheduledDate.setDate(birthDate.getDate() + vaccine.ageInDays);
        
        await storage.createVaccinationRecord({
          childId: child.id,
          vaccineName: vaccine.vaccineName,
          vaccineCode: vaccine.vaccineCode,
          doseNumber: vaccine.doseNumber,
          scheduledDate: scheduledDate.toISOString().split('T')[0],
          status: "scheduled",
        });
      }
      
      // Create a welcome notification
      await notificationService.sendInAppNotification({
        userId,
        type: "system",
        title: `${child.firstName}'s schedule created`,
        message: `Vaccination schedule for ${child.firstName} has been generated based on ${child.country} guidelines.`,
      });
      
      res.status(201).json(child);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating child:", error);
      res.status(500).json({ message: "Failed to create child" });
    }
  });

  app.patch('/api/children/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const child = await storage.updateChild(id, req.body);
      
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      
      res.json(child);
    } catch (error) {
      console.error("Error updating child:", error);
      res.status(500).json({ message: "Failed to update child" });
    }
  });

  app.delete('/api/children/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteChild(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting child:", error);
      res.status(500).json({ message: "Failed to delete child" });
    }
  });

  // Vaccination routes
  app.get('/api/vaccinations/upcoming', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const days = parseInt(req.query.days as string) || 30;
      const records = await storage.getUpcomingVaccinations(userId, days);
      
      // Add child name to each record
      const childrenList = await storage.getChildren(userId);
      const childMap = new Map(childrenList.map((c) => [c.id, c]));
      
      const recordsWithNames = records.map((r) => ({
        ...r,
        childName: childMap.get(r.childId)?.firstName || "Unknown",
      }));
      
      res.json(recordsWithNames);
    } catch (error) {
      console.error("Error fetching upcoming vaccinations:", error);
      res.status(500).json({ message: "Failed to fetch vaccinations" });
    }
  });

  app.get('/api/vaccinations/all', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const records = await storage.getVaccinationRecordsByUser(userId);
      
      // Add child name to each record
      const childrenList = await storage.getChildren(userId);
      const childMap = new Map(childrenList.map((c) => [c.id, c]));
      
      const recordsWithNames = records.map((r) => ({
        ...r,
        childName: childMap.get(r.childId)?.firstName || "Unknown",
        childId: r.childId,
      }));
      
      res.json(recordsWithNames);
    } catch (error) {
      console.error("Error fetching all vaccinations:", error);
      res.status(500).json({ message: "Failed to fetch vaccinations" });
    }
  });

  app.patch('/api/vaccinations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const oldRecord = await storage.getVaccinationRecordById(id);
      const record = await storage.updateVaccinationRecord(id, req.body);
      
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }

      // Send notification if vaccine was just marked as completed
      if (oldRecord && !oldRecord.administeredDate && req.body.administeredDate) {
        const child = await storage.getChild(record.childId);
        if (child) {
          await notificationService.sendInAppNotification({
            userId: child.userId,
            type: "system",
            title: `${record.vaccineName} completed`,
            message: `${record.vaccineName} has been recorded for ${child.firstName}. Great job staying on schedule!`,
          });
        }
      }
      
      res.json(record);
    } catch (error) {
      console.error("Error updating vaccination record:", error);
      res.status(500).json({ message: "Failed to update record" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notificationsList = await storage.getNotifications(userId);
      res.json(notificationsList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.markNotificationRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification read:", error);
      res.status(500).json({ message: "Failed to mark notification read" });
    }
  });

  app.post('/api/notifications/mark-all-read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsRead(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications read:", error);
      res.status(500).json({ message: "Failed to mark notifications read" });
    }
  });

  // Clinic routes - Real data from database
  app.get('/api/clinic/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clinic = await storage.getClinicForUser(userId);
      
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }

      const stats = await storage.getClinicStats(clinic.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching clinic stats:", error);
      res.status(500).json({ message: "Failed to fetch clinic stats" });
    }
  });

  app.get('/api/clinic/patients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clinic = await storage.getClinicForUser(userId);
      
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }

      const patients = await storage.getClinicPatients(clinic.id);
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get('/api/clinic/appointments/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clinic = await storage.getClinicForUser(userId);
      
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }

      const appointments = await storage.getClinicAppointmentsToday(clinic.id);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Clinic analytics
  app.get('/api/clinic/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clinic = await storage.getClinicForUser(userId);
      
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }

      const analytics = await storage.getClinicalAnalytics(clinic.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Web Push Notifications
  app.post('/api/push/subscribe', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { endpoint, keys } = req.body;

      if (!endpoint || !keys) {
        return res.status(400).json({ message: "Invalid subscription data" });
      }

      // Store push subscription
      const subscription = await db.insert(pushSubscriptions).values({
        userId,
        endpoint,
        keys: keys as any,
      }).returning();

      res.json({ success: true, subscription: subscription[0] });
    } catch (error) {
      console.error("Error subscribing to push:", error);
      res.status(500).json({ message: "Failed to subscribe to push" });
    }
  });

  app.post('/api/push/send', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title, message } = req.body;

      // Create notification (clients will pick it up via polling or WebSocket)
      const notification = await storage.createNotification({
        userId,
        type: "system",
        title,
        message,
      });

      res.json(notification);
    } catch (error) {
      console.error("Error sending push:", error);
      res.status(500).json({ message: "Failed to send push" });
    }
  });

  // Admin routes - System configuration
  app.get('/api/admin/configuration', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== "superadmin" && user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const config = await storage.getSystemConfiguration();
      res.json(config || {});
    } catch (error) {
      console.error("Error fetching configuration:", error);
      res.status(500).json({ message: "Failed to fetch configuration" });
    }
  });

  app.post('/api/admin/configuration', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmin can modify configuration" });
      }

      const config = await storage.updateSystemConfiguration(req.body);
      res.json(config);
    } catch (error) {
      console.error("Error updating configuration:", error);
      res.status(500).json({ message: "Failed to update configuration" });
    }
  });

  // Clinic branding routes
  app.get('/api/admin/clinic/:clinicId/branding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const clinic = await storage.getClinicForUser(userId);

      if (user?.role === "clinic" && (!clinic || clinic.id !== req.params.clinicId)) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (user?.role !== "superadmin" && user?.role !== "admin" && user?.role !== "clinic") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const branding = await storage.getClinicBranding(req.params.clinicId);
      res.json(branding || {});
    } catch (error) {
      console.error("Error fetching branding:", error);
      res.status(500).json({ message: "Failed to fetch branding" });
    }
  });

  app.post('/api/admin/clinic/:clinicId/branding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const clinic = await storage.getClinicForUser(userId);

      if (user?.role === "clinic" && (!clinic || clinic.id !== req.params.clinicId)) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (user?.role !== "superadmin" && user?.role !== "admin" && user?.role !== "clinic") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const branding = await storage.updateClinicBranding(req.params.clinicId, req.body);
      res.json(branding);
    } catch (error) {
      console.error("Error updating branding:", error);
      res.status(500).json({ message: "Failed to update branding" });
    }
  });

  // Bulk vaccination update
  app.post('/api/clinic/vaccinations/bulk-update', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "clinic" && user?.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { vaccinationIds, status } = req.body;
      if (!vaccinationIds || !Array.isArray(vaccinationIds) || !status) {
        return res.status(400).json({ message: "Invalid request" });
      }

      const success = await storage.bulkUpdateVaccinations(vaccinationIds, status);
      
      if (success) {
        res.json({ success: true, updated: vaccinationIds.length });
      } else {
        res.status(500).json({ message: "Failed to bulk update vaccinations" });
      }
    } catch (error) {
      console.error("Error bulk updating vaccinations:", error);
      res.status(500).json({ message: "Failed to bulk update vaccinations" });
    }
  });

  // Landing page branding (Superadmin)
  app.get('/api/public/landing-branding', async (req: any, res) => {
    try {
      const branding = await storage.getLandingPageBranding();
      res.json(branding || {});
    } catch (error) {
      console.error("Error fetching landing branding:", error);
      res.status(500).json({ message: "Failed to fetch branding" });
    }
  });

  app.post('/api/admin/landing-branding', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmin can customize landing page" });
      }

      const branding = await storage.updateLandingPageBranding(req.body);
      res.json(branding);
    } catch (error) {
      console.error("Error updating landing branding:", error);
      res.status(500).json({ message: "Failed to update branding" });
    }
  });

  // Clinic lookup by name
  app.get('/api/clinics/search/:name', async (req: any, res) => {
    try {
      const { name } = req.params;
      const clinic = await storage.getClinicByName(name);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      res.json(clinic);
    } catch (error) {
      console.error("Error searching clinic:", error);
      res.status(500).json({ message: "Failed to search clinic" });
    }
  });

  // Clinic lookup by domain
  app.get('/api/clinics/domain/:domain', async (req: any, res) => {
    try {
      const { domain } = req.params;
      const clinic = await storage.getClinicByDomain(domain);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      res.json(clinic);
    } catch (error) {
      console.error("Error searching clinic by domain:", error);
      res.status(500).json({ message: "Failed to search clinic" });
    }
  });

  app.get('/api/clinics/branding/:clinicId', async (req: any, res) => {
    try {
      const { clinicId } = req.params;
      const branding = await storage.getClinicBranding(clinicId);
      res.json(branding || {});
    } catch (error) {
      console.error("Error fetching clinic branding:", error);
      res.status(500).json({ message: "Failed to fetch branding" });
    }
  });

  // Multi-clinic support
  app.get('/api/user/clinics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const clinics = await storage.getUserClinics(userId);
      res.json(clinics);
    } catch (error) {
      console.error("Error fetching user clinics:", error);
      res.status(500).json({ message: "Failed to fetch clinics" });
    }
  });

  app.post('/api/user/clinics/:clinicId/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { clinicId } = req.params;
      const clinic = await storage.getClinicForUser(userId);

      // Verify clinic exists
      const targetClinic = await db.select().from(clinics).where(eq(clinics.id, clinicId)).limit(1);
      if (targetClinic.length === 0) {
        return res.status(404).json({ message: "Clinic not found" });
      }

      const assoc = await storage.addUserToClinic(userId, clinicId, "admin");
      res.json(assoc);
    } catch (error) {
      console.error("Error joining clinic:", error);
      res.status(500).json({ message: "Failed to join clinic" });
    }
  });

  return httpServer;
}
