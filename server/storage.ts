import { db } from "./db";
import { users, children, vaccinationRecords, notifications } from "@shared/schema";
import { eq } from "drizzle-orm";

export const storage = {
  async getUser(userId: string) {
    const result = await db.select().from(users).where(eq(users.id, userId));
    return result[0] || null;
  },

  async getChildren(userId: string) {
    return db.select().from(children).where(eq(children.userId, userId));
  },

  async addChild(userId: string, data: any) {
    const result = await db.insert(children).values({ userId, ...data }).returning();
    return result[0];
  },

  async getVaccinationRecords(childId: string) {
    return db.select().from(vaccinationRecords).where(eq(vaccinationRecords.childId, childId));
  },

  async getDashboardStats(userId: string) {
    const childrenList = await db.select().from(children).where(eq(children.userId, userId));
    const childCount = childrenList.length;

    let completedVaccines = 0;
    let overdueVaccines = 0;

    for (const child of childrenList) {
      const records = await db.select().from(vaccinationRecords).where(eq(vaccinationRecords.childId, child.id));
      completedVaccines += records.filter(r => r.status === "completed").length;
      overdueVaccines += records.filter(r => r.status === "overdue").length;
    }

    return {
      totalChildren: childCount,
      completedVaccines,
      overdueVaccines,
    };
  },

  async getNotifications(userId: string) {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy((n) => [n.createdAt]);
  },
};
