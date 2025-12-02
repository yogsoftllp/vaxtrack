import { db } from "./db";

export const storage = {
  async getUser(userId: string) {
    return db.user.findUnique({ where: { id: userId } });
  },

  async getChildren(userId: string) {
    return db.child.findMany({ where: { userId } });
  },

  async addChild(userId: string, data: any) {
    return db.child.create({
      data: { userId, ...data },
    });
  },

  async getVaccinationRecords(childId: string) {
    return db.vaccinationRecord.findMany({ where: { childId } });
  },

  async getDashboardStats(userId: string) {
    const children = await db.child.findMany({ where: { userId } });
    
    let completedVaccines = 0;
    let overdueVaccines = 0;

    for (const child of children) {
      const records = await db.vaccinationRecord.findMany({
        where: { childId: child.id },
      });
      completedVaccines += records.filter((r) => r.status === "completed").length;
      overdueVaccines += records.filter((r) => r.status === "overdue").length;
    }

    return {
      totalChildren: children.length,
      completedVaccines,
      overdueVaccines,
    };
  },

  async getNotifications(userId: string) {
    return db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },
};
