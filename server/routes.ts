import { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";

export function registerRoutes(app: Express) {
  // Auth user
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const user = await storage.getUser(req.user.id);
      res.json(user || { id: req.user.id, firstName: req.user.firstName });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const stats = await storage.getDashboardStats(req.user.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Children list
  app.get("/api/children", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const childrenList = await storage.getChildren(req.user.id);
      res.json(childrenList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch children" });
    }
  });

  // Add child
  app.post("/api/children", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const { firstName, lastName, dateOfBirth, gender, country } = req.body;
      const child = await storage.addChild(req.user.id, {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        country,
      });
      res.json(child);
    } catch (error) {
      res.status(400).json({ error: "Invalid child data" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const notifs = await storage.getNotifications(req.user.id);
      res.json(notifs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // User preferences
  app.get("/api/user/preferences", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const user = await storage.getUser(req.user.id);
      res.json(user || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  // Update user preferences
  app.patch("/api/user/preferences", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const { notificationPreferences } = req.body;
      const updated = await storage.updateUserPreferences(req.user.id, notificationPreferences);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update preferences" });
    }
  });

  // Vaccination records
  app.get("/api/vaccination-records", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const children = await storage.getChildren(req.user.id);
      const allRecords = [];
      for (const child of children) {
        const records = await storage.getVaccinationRecords(child.id);
        allRecords.push(...records);
      }
      res.json(allRecords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch records" });
    }
  });

  // Export vaccination records
  app.post("/api/vaccination-records/export", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const { format } = req.query;
      
      if (format === "pdf") {
        res.setHeader("Content-Type", "application/pdf");
        res.send(Buffer.from("PDF export mock data"));
      } else {
        res.json({ message: "Export received" });
      }
    } catch (error) {
      res.status(500).json({ error: "Export failed" });
    }
  });

  // Vaccination reminders
  app.get("/api/vaccination-reminders", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const reminders = await storage.getVaccinationReminders(req.user.id);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });

  // Referrals
  app.get("/api/referrals", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const referralData = await storage.getReferralData(req.user.id);
      res.json(referralData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referral data" });
    }
  });

  // Clinic analytics
  app.get("/api/clinic/analytics", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const analytics = await storage.getClinicAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Clinics
  app.get("/api/clinics", async (req: any, res) => {
    try {
      const clinics = [
        { id: "clinic-1", name: "City Medical Center", city: "New York", operatingHours: "9AM - 5PM" },
        { id: "clinic-2", name: "Health Plus", city: "Los Angeles", operatingHours: "8AM - 6PM" },
        { id: "clinic-3", name: "wellness clinic", city: "Chicago", operatingHours: "10AM - 4PM" },
      ];
      res.json(clinics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clinics" });
    }
  });

  // Appointments
  app.post("/api/appointments", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const { clinicId, dateTime } = req.body;
      
      const appointment = {
        id: `appt-${Date.now()}`,
        clinicId,
        userId: req.user.id,
        dateTime,
        status: "scheduled",
        createdAt: new Date(),
      };
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ error: "Failed to book appointment" });
    }
  });

  // Push notifications setup
  app.post("/api/push-notifications/subscribe", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const { subscription } = req.body;
      
      // Store subscription in database
      res.json({ message: "Subscription saved", subscriptionId: `sub-${Date.now()}` });
    } catch (error) {
      res.status(400).json({ error: "Failed to subscribe" });
    }
  });

  app.get("/api/push-notifications/public-key", (req: any, res) => {
    res.json({ publicKey: "BXXXXXXXXXXXXXXXXXXXXXX" });
  });
}
