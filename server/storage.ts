import {
  users,
  children,
  vaccinationSchedules,
  vaccinationRecords,
  clinics,
  appointments,
  notifications,
  pushSubscriptions,
  systemConfiguration,
  clinicBranding,
  userClinicAssociation,
  landingPageBranding,
  vaccinePricing,
  type User,
  type UpsertUser,
  type Child,
  type InsertChild,
  type VaccinationSchedule,
  type InsertVaccinationSchedule,
  type VaccinationRecord,
  type InsertVaccinationRecord,
  type Clinic,
  type InsertClinic,
  type Appointment,
  type InsertAppointment,
  type Notification,
  type InsertNotification,
  type PushSubscription,
  type InsertPushSubscription,
  type SystemConfiguration,
  type ClinicBranding,
  type InsertSystemConfiguration,
  type InsertClinicBranding,
  type LandingPageBranding,
  type InsertLandingPageBranding,
  type UserClinicAssociation,
  type InsertUserClinicAssociation,
  type VaccinePricing,
  type InsertVaccinePricing,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql, isNull, or, lt } from "drizzle-orm";

export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPreferences(id: string, preferences: any): Promise<User | undefined>;
  
  // Child operations
  getChildren(userId: string): Promise<Child[]>;
  getChild(id: string): Promise<Child | undefined>;
  createChild(child: InsertChild): Promise<Child>;
  updateChild(id: string, child: Partial<InsertChild>): Promise<Child | undefined>;
  deleteChild(id: string): Promise<boolean>;
  
  // Vaccination schedule operations
  getVaccinationSchedules(country: string): Promise<VaccinationSchedule[]>;
  seedVaccinationSchedules(schedules: InsertVaccinationSchedule[]): Promise<void>;
  
  // Vaccination record operations
  getVaccinationRecords(childId: string): Promise<VaccinationRecord[]>;
  getVaccinationRecordById(id: string): Promise<VaccinationRecord | undefined>;
  getVaccinationRecordsByUser(userId: string): Promise<VaccinationRecord[]>;
  getUpcomingVaccinations(userId: string, days?: number): Promise<VaccinationRecord[]>;
  createVaccinationRecord(record: InsertVaccinationRecord): Promise<VaccinationRecord>;
  updateVaccinationRecord(id: string, record: Partial<InsertVaccinationRecord>): Promise<VaccinationRecord | undefined>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: string, notification: Partial<InsertNotification>): Promise<Notification | undefined>;
  markNotificationRead(id: string): Promise<boolean>;
  markAllNotificationsRead(userId: string): Promise<boolean>;

  // Clinic operations
  getClinicForUser(userId: string): Promise<any | undefined>;
  getClinicPatients(clinicId: string): Promise<any[]>;
  getClinicStats(clinicId: string): Promise<any>;
  getClinicAppointmentsToday(clinicId: string): Promise<any[]>;
  getClinicalAnalytics(clinicId: string, days?: number): Promise<any>;
  
  // Dashboard stats
  getDashboardStats(userId: string): Promise<{
    totalChildren: number;
    upcomingVaccines: number;
    overdueVaccines: number;
    completedVaccines: number;
  }>;

  // Admin operations
  getSystemConfiguration(): Promise<SystemConfiguration | undefined>;
  updateSystemConfiguration(config: InsertSystemConfiguration): Promise<SystemConfiguration | undefined>;
  getClinicBranding(clinicId: string): Promise<ClinicBranding | undefined>;
  updateClinicBranding(clinicId: string, branding: InsertClinicBranding): Promise<ClinicBranding | undefined>;
  bulkUpdateVaccinations(vaccinationIds: string[], status: string): Promise<boolean>;
  
  // Landing page branding (Superadmin)
  getLandingPageBranding(): Promise<LandingPageBranding | undefined>;
  updateLandingPageBranding(branding: InsertLandingPageBranding): Promise<LandingPageBranding | undefined>;
  
  // Multi-clinic support
  getClinicByName(name: string): Promise<Clinic | undefined>;
  getClinicByDomain(domain: string): Promise<Clinic | undefined>;
  getUserClinics(userId: string): Promise<Clinic[]>;
  addUserToClinic(userId: string, clinicId: string, role: string): Promise<UserClinicAssociation>;
  removeUserFromClinic(userId: string, clinicId: string): Promise<boolean>;
  getUserClinicAssociations(userId: string): Promise<UserClinicAssociation[]>;
  
  // Clinic search and pricing
  getNearByClinics(city: string, country: string): Promise<any[]>;
  getVaccinePricing(clinicId: string): Promise<VaccinePricing[]>;
  upsertVaccinePricing(clinicId: string, pricing: InsertVaccinePricing): Promise<VaccinePricing>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPreferences(id: string, preferences: any): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        notificationPreferences: preferences,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Child operations
  async getChildren(userId: string): Promise<Child[]> {
    return await db.select().from(children).where(eq(children.userId, userId));
  }

  async getChild(id: string): Promise<Child | undefined> {
    const [child] = await db.select().from(children).where(eq(children.id, id));
    return child;
  }

  async createChild(child: InsertChild): Promise<Child> {
    const [newChild] = await db.insert(children).values(child).returning();
    return newChild;
  }

  async updateChild(id: string, child: Partial<InsertChild>): Promise<Child | undefined> {
    const [updated] = await db
      .update(children)
      .set({ ...child, updatedAt: new Date() })
      .where(eq(children.id, id))
      .returning();
    return updated;
  }

  async deleteChild(id: string): Promise<boolean> {
    const result = await db.delete(children).where(eq(children.id, id));
    return true;
  }

  // Vaccination schedule operations
  async getVaccinationSchedules(country: string): Promise<VaccinationSchedule[]> {
    return await db
      .select()
      .from(vaccinationSchedules)
      .where(eq(vaccinationSchedules.country, country));
  }

  async seedVaccinationSchedules(schedules: InsertVaccinationSchedule[]): Promise<void> {
    for (const schedule of schedules) {
      await db
        .insert(vaccinationSchedules)
        .values(schedule)
        .onConflictDoNothing();
    }
  }

  // Vaccination record operations
  async getVaccinationRecords(childId: string): Promise<VaccinationRecord[]> {
    return await db
      .select()
      .from(vaccinationRecords)
      .where(eq(vaccinationRecords.childId, childId))
      .orderBy(vaccinationRecords.scheduledDate);
  }

  async getVaccinationRecordById(id: string): Promise<VaccinationRecord | undefined> {
    const [record] = await db.select().from(vaccinationRecords).where(eq(vaccinationRecords.id, id));
    return record;
  }

  async getVaccinationRecordsByUser(userId: string): Promise<VaccinationRecord[]> {
    const userChildren = await this.getChildren(userId);
    const childIds = userChildren.map((c) => c.id);
    
    if (childIds.length === 0) return [];
    
    const allRecords: VaccinationRecord[] = [];
    for (const childId of childIds) {
      const records = await db
        .select()
        .from(vaccinationRecords)
        .where(eq(vaccinationRecords.childId, childId))
        .orderBy(vaccinationRecords.scheduledDate);
      allRecords.push(...records);
    }
    
    return allRecords.sort((a, b) => 
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );
  }

  async getUpcomingVaccinations(userId: string, days: number = 30): Promise<VaccinationRecord[]> {
    const userChildren = await this.getChildren(userId);
    const childIds = userChildren.map((c) => c.id);
    
    if (childIds.length === 0) return [];
    
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    const allRecords: VaccinationRecord[] = [];
    for (const childId of childIds) {
      const records = await db
        .select()
        .from(vaccinationRecords)
        .where(
          and(
            eq(vaccinationRecords.childId, childId),
            isNull(vaccinationRecords.administeredDate),
            gte(vaccinationRecords.scheduledDate, today.toISOString().split('T')[0]),
            lte(vaccinationRecords.scheduledDate, futureDate.toISOString().split('T')[0])
          )
        )
        .orderBy(vaccinationRecords.scheduledDate);
      allRecords.push(...records);
    }
    
    return allRecords.sort((a, b) => 
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );
  }

  async createVaccinationRecord(record: InsertVaccinationRecord): Promise<VaccinationRecord> {
    const [newRecord] = await db.insert(vaccinationRecords).values(record).returning();
    return newRecord;
  }

  async updateVaccinationRecord(id: string, record: Partial<InsertVaccinationRecord>): Promise<VaccinationRecord | undefined> {
    const [updated] = await db
      .update(vaccinationRecords)
      .set({ ...record, updatedAt: new Date() })
      .where(eq(vaccinationRecords.id, id))
      .returning();
    return updated;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationRead(id: string): Promise<boolean> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
    return true;
  }

  async markAllNotificationsRead(userId: string): Promise<boolean> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId));
    return true;
  }

  async updateNotification(id: string, notification: Partial<InsertNotification>): Promise<Notification | undefined> {
    const [updated] = await db
      .update(notifications)
      .set(notification)
      .where(eq(notifications.id, id))
      .returning();
    return updated;
  }

  // Clinic operations
  async getClinicForUser(userId: string): Promise<any | undefined> {
    const clinic = await db.query.clinics.findFirst({
      where: eq(clinics.userId, userId),
    });
    return clinic;
  }

  async getClinicPatients(clinicId: string): Promise<any[]> {
    // Get all appointments for this clinic's patients
    const clinicAppointments = await db
      .select({
        childId: appointments.childId,
        clinicId: appointments.clinicId,
      })
      .from(appointments)
      .where(eq(appointments.clinicId, clinicId));

    const childIds = Array.from(new Set(clinicAppointments.map(a => a.childId)));
    if (childIds.length === 0) return [];

    const patientData: any[] = [];
    for (const childId of childIds) {
      const child = await this.getChild(childId);
      const user = child ? await this.getUser(child.userId) : null;
      const records = await this.getVaccinationRecords(childId);
      
      const today = new Date().toISOString().split('T')[0];
      const nextUncompletedRecord = records.find(
        r => !r.administeredDate && new Date(r.scheduledDate) >= new Date(today)
      );

      patientData.push({
        id: child?.id,
        childName: child?.firstName,
        parentName: user?.firstName,
        lastVisit: records.filter(r => r.administeredDate).sort((a, b) => 
          new Date(b.administeredDate!).getTime() - new Date(a.administeredDate!).getTime()
        )[0]?.administeredDate || "Never",
        nextVaccine: nextUncompletedRecord?.vaccineName || "None",
        nextVaccineDate: nextUncompletedRecord?.scheduledDate || "N/A",
        status: nextUncompletedRecord
          ? new Date(nextUncompletedRecord.scheduledDate) < new Date(today)
            ? "overdue"
            : new Date(nextUncompletedRecord.scheduledDate) <= new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            ? "due_soon"
            : "up_to_date"
          : "up_to_date",
      });
    }

    return patientData;
  }

  async getClinicStats(clinicId: string): Promise<any> {
    const clinic = await db.query.clinics.findFirst({
      where: eq(clinics.id, clinicId),
    });

    if (!clinic) return { totalPatients: 0, todayAppointments: 0, overdueVaccines: 0, completionRate: 0 };

    const patients = await this.getClinicPatients(clinicId);
    const today = new Date().toISOString().split('T')[0];

    const todayAppointments = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.clinicId, clinicId),
          eq(sql`DATE(scheduled_date_time)`, today)
        )
      );

    const overdueCount = patients.filter(p => p.status === "overdue").length;
    const completionRate = patients.length > 0
      ? Math.round(((patients.length - overdueCount) / patients.length) * 100)
      : 0;

    return {
      totalPatients: patients.length,
      todayAppointments: todayAppointments.length,
      overdueVaccines: overdueCount,
      completionRate,
    };
  }

  async getClinicAppointmentsToday(clinicId: string): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];

    const appointmentsData = await db
      .select({
        appointmentId: appointments.id,
        scheduledDateTime: appointments.scheduledDateTime,
        status: appointments.status,
        childId: appointments.childId,
        vaccinationRecordId: appointments.vaccinationRecordId,
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.clinicId, clinicId),
          eq(sql`DATE(scheduled_date_time)`, today)
        )
      );

    const result: any[] = [];
    for (const appt of appointmentsData) {
      const child = await this.getChild(appt.childId);
      const user = child ? await this.getUser(child.userId) : null;
      const record = appt.vaccinationRecordId ? await this.getVaccinationRecordById(appt.vaccinationRecordId) : null;

      result.push({
        id: appt.appointmentId,
        time: new Date(appt.scheduledDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        childName: child?.firstName || "Unknown",
        parentName: user?.firstName || "Unknown",
        vaccine: record?.vaccineName || "General",
        status: appt.status,
      });
    }

    return result.sort((a, b) => a.time.localeCompare(b.time));
  }

  async getClinicalAnalytics(clinicId: string, days: number = 90): Promise<any> {
    const clinic = await db.query.clinics.findFirst({
      where: eq(clinics.id, clinicId),
    });

    if (!clinic) return { vaccinationsByType: {}, weeklyTrend: [], coverage: 0 };

    const patients = await this.getClinicPatients(clinicId);
    const allRecords: any[] = [];

    for (const patient of patients) {
      const records = await db
        .select()
        .from(vaccinationRecords)
        .where(eq(vaccinationRecords.childId, patient.id));
      allRecords.push(...records);
    }

    // Group vaccines by type
    const vaccinationsByType: { [key: string]: number } = {};
    allRecords.forEach(r => {
      vaccinationsByType[r.vaccineName] = (vaccinationsByType[r.vaccineName] || 0) + 1;
    });

    // Calculate coverage
    const completedCount = allRecords.filter(r => r.administeredDate).length;
    const coverage = allRecords.length > 0 ? Math.round((completedCount / allRecords.length) * 100) : 0;

    return {
      vaccinationsByType,
      coverage,
      totalVaccinations: allRecords.length,
      totalCompleted: completedCount,
      totalPending: allRecords.length - completedCount,
    };
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    totalChildren: number;
    upcomingVaccines: number;
    overdueVaccines: number;
    completedVaccines: number;
  }> {
    const userChildren = await this.getChildren(userId);
    const childIds = userChildren.map((c) => c.id);
    
    if (childIds.length === 0) {
      return {
        totalChildren: 0,
        upcomingVaccines: 0,
        overdueVaccines: 0,
        completedVaccines: 0,
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    let upcomingCount = 0;
    let overdueCount = 0;
    let completedCount = 0;
    
    for (const childId of childIds) {
      // Upcoming vaccines (in next 30 days)
      const upcoming = await db
        .select()
        .from(vaccinationRecords)
        .where(
          and(
            eq(vaccinationRecords.childId, childId),
            isNull(vaccinationRecords.administeredDate),
            gte(vaccinationRecords.scheduledDate, today),
            lte(vaccinationRecords.scheduledDate, futureDateStr)
          )
        );
      upcomingCount += upcoming.length;
      
      // Overdue vaccines
      const overdue = await db
        .select()
        .from(vaccinationRecords)
        .where(
          and(
            eq(vaccinationRecords.childId, childId),
            isNull(vaccinationRecords.administeredDate),
            lt(vaccinationRecords.scheduledDate, today)
          )
        );
      overdueCount += overdue.length;
      
      // Completed vaccines
      const completed = await db
        .select()
        .from(vaccinationRecords)
        .where(
          and(
            eq(vaccinationRecords.childId, childId),
            eq(vaccinationRecords.status, "completed")
          )
        );
      completedCount += completed.length;
    }

    return {
      totalChildren: userChildren.length,
      upcomingVaccines: upcomingCount,
      overdueVaccines: overdueCount,
      completedVaccines: completedCount,
    };
  }

  // Admin operations
  async getSystemConfiguration(): Promise<SystemConfiguration | undefined> {
    const config = await db.query.systemConfiguration.findFirst();
    return config;
  }

  async updateSystemConfiguration(config: InsertSystemConfiguration): Promise<SystemConfiguration | undefined> {
    const existing = await this.getSystemConfiguration();
    
    if (existing) {
      const [updated] = await db
        .update(systemConfiguration)
        .set({ ...config, updatedAt: new Date() })
        .where(eq(systemConfiguration.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(systemConfiguration)
        .values(config)
        .returning();
      return created;
    }
  }

  async getClinicBranding(clinicId: string): Promise<ClinicBranding | undefined> {
    const branding = await db.query.clinicBranding.findFirst({
      where: eq(clinicBranding.clinicId, clinicId),
    });
    return branding;
  }

  async updateClinicBranding(clinicId: string, branding: InsertClinicBranding): Promise<ClinicBranding | undefined> {
    const existing = await this.getClinicBranding(clinicId);
    
    if (existing) {
      const [updated] = await db
        .update(clinicBranding)
        .set({ ...branding, updatedAt: new Date() })
        .where(eq(clinicBranding.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(clinicBranding)
        .values({ ...branding, clinicId } as any)
        .returning();
      return created;
    }
  }

  async bulkUpdateVaccinations(vaccinationIds: string[], status: string): Promise<boolean> {
    try {
      await db
        .update(vaccinationRecords)
        .set({ 
          status: status as any,
          administeredDate: status === "completed" ? new Date().toISOString().split('T')[0] : null,
          updatedAt: new Date()
        })
        .where(
          and(
            vaccinationIds.length > 0 
              ? sql`id = ANY(${vaccinationIds})`
              : sql`false`
          )
        );
      return true;
    } catch (error) {
      console.error("Error bulk updating vaccinations:", error);
      return false;
    }
  }

  // Landing page branding
  async getLandingPageBranding(): Promise<LandingPageBranding | undefined> {
    const [branding] = await db.select().from(landingPageBranding).limit(1);
    return branding;
  }

  async updateLandingPageBranding(brandingData: InsertLandingPageBranding): Promise<LandingPageBranding | undefined> {
    const existing = await this.getLandingPageBranding();
    
    if (existing) {
      const [updated] = await db
        .update(landingPageBranding)
        .set({ ...brandingData, updatedAt: new Date() })
        .where(eq(landingPageBranding.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(landingPageBranding)
        .values(brandingData)
        .returning();
      return created;
    }
  }

  // Multi-clinic support
  async getClinicByName(name: string): Promise<Clinic | undefined> {
    const [clinic] = await db
      .select()
      .from(clinics)
      .where(eq(clinics.name, name))
      .limit(1);
    return clinic;
  }

  async getClinicByDomain(domain: string): Promise<Clinic | undefined> {
    const [clinic] = await db
      .select()
      .from(clinics)
      .where(eq(clinics.customDomain, domain))
      .limit(1);
    return clinic;
  }

  async getUserClinics(userId: string): Promise<Clinic[]> {
    const associations = await db
      .select()
      .from(userClinicAssociation)
      .where(eq(userClinicAssociation.userId, userId));
    
    const clinicList: Clinic[] = [];
    for (const assoc of associations) {
      const clinic = await db
        .select()
        .from(clinics)
        .where(eq(clinics.id, assoc.clinicId));
      if (clinic.length > 0) {
        clinicList.push(clinic[0]);
      }
    }
    return clinicList;
  }

  async addUserToClinic(userId: string, clinicId: string, role: string = "admin"): Promise<UserClinicAssociation> {
    const [assoc] = await db
      .insert(userClinicAssociation)
      .values({ userId, clinicId, role } as any)
      .returning();
    return assoc;
  }

  async removeUserFromClinic(userId: string, clinicId: string): Promise<boolean> {
    await db
      .delete(userClinicAssociation)
      .where(and(
        eq(userClinicAssociation.userId, userId),
        eq(userClinicAssociation.clinicId, clinicId)
      ));
    return true;
  }

  async getUserClinicAssociations(userId: string): Promise<UserClinicAssociation[]> {
    return await db
      .select()
      .from(userClinicAssociation)
      .where(eq(userClinicAssociation.userId, userId));
  }

  // Clinic search and pricing
  async getNearByClinics(city: string, country: string): Promise<any[]> {
    const clinicList = await db
      .select({
        id: clinics.id,
        name: clinics.name,
        city: clinics.city,
        country: clinics.country,
        address: clinics.address,
        phone: clinics.phone,
        email: clinics.email,
        website: clinics.website,
      })
      .from(clinics)
      .where(and(
        eq(clinics.city, city),
        eq(clinics.country, country),
        eq(clinics.verified, true)
      ));

    // Enrich with branding and pricing
    const enrichedClinics = await Promise.all(
      clinicList.map(async (clinic) => {
        const brandingData = await this.getClinicBranding(clinic.id);
        const pricing = await this.getVaccinePricing(clinic.id);
        return {
          ...clinic,
          branding: brandingData,
          vaccinePricing: pricing,
          priceRange: pricing.length > 0
            ? {
                min: Math.min(...pricing.map(p => p.price)) / 100,
                max: Math.max(...pricing.map(p => p.price)) / 100,
                currency: pricing[0]?.currency || "USD"
              }
            : null
        };
      })
    );

    return enrichedClinics;
  }

  async getVaccinePricing(clinicId: string): Promise<VaccinePricing[]> {
    return await db
      .select()
      .from(vaccinePricing)
      .where(eq(vaccinePricing.clinicId, clinicId));
  }

  async upsertVaccinePricing(clinicId: string, pricingData: InsertVaccinePricing): Promise<VaccinePricing> {
    const existing = await db
      .select()
      .from(vaccinePricing)
      .where(and(
        eq(vaccinePricing.clinicId, clinicId),
        eq(vaccinePricing.vaccineCode, pricingData.vaccineCode || "")
      ))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(vaccinePricing)
        .set({ ...pricingData, updatedAt: new Date() })
        .where(eq(vaccinePricing.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(vaccinePricing)
        .values({ clinicId, ...pricingData } as any)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
