import {
  users,
  children,
  vaccinationSchedules,
  vaccinationRecords,
  clinics,
  appointments,
  notifications,
  pushSubscriptions,
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
  getVaccinationRecordsByUser(userId: string): Promise<VaccinationRecord[]>;
  getUpcomingVaccinations(userId: string, days?: number): Promise<VaccinationRecord[]>;
  createVaccinationRecord(record: InsertVaccinationRecord): Promise<VaccinationRecord>;
  updateVaccinationRecord(id: string, record: Partial<InsertVaccinationRecord>): Promise<VaccinationRecord | undefined>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<boolean>;
  markAllNotificationsRead(userId: string): Promise<boolean>;
  
  // Dashboard stats
  getDashboardStats(userId: string): Promise<{
    totalChildren: number;
    upcomingVaccines: number;
    overdueVaccines: number;
    completedVaccines: number;
  }>;
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
}

export const storage = new DatabaseStorage();
