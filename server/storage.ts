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

  async updateUserPreferences(userId: string, preferences: any) {
    return db.user.update({
      where: { id: userId },
      data: { notificationPreferences: preferences },
    });
  },

  async getVaccinationReminders(userId: string) {
    const children = await db.child.findMany({ where: { userId } });
    const reminders = [];
    
    for (const child of children) {
      const records = await db.vaccinationRecord.findMany({
        where: { childId: child.id, status: "scheduled" },
        orderBy: { scheduledDate: "asc" },
        take: 5,
      });
      reminders.push(
        ...records.map((r) => ({
          id: `${child.id}-${r.id}`,
          message: `${child.firstName} needs ${r.vaccineName}`,
          dueDate: r.scheduledDate,
          childId: child.id,
        }))
      );
    }
    return reminders.slice(0, 5);
  },

  async getReferralData(userId: string) {
    const user = await db.user.findUnique({ where: { id: userId } });
    return {
      code: `VAXTRACK${userId.substring(0, 6).toUpperCase()}`,
      successfulReferrals: user?.successfulReferrals || 0,
      targetReferrals: 5,
    };
  },

  async getClinicAnalytics() {
    const records = await db.vaccinationRecord.findMany();
    const completed = records.filter((r) => r.status === "completed").length;
    const total = records.length;
    
    return {
      totalPatients: (await db.child.findMany()).length,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      overdueAppointments: records.filter((r) => r.status === "overdue").length,
      appointmentsThisWeek: 12, // Mock data
      topVaccines: [
        { name: "DPT", count: 45 },
        { name: "Polio", count: 42 },
        { name: "MMR", count: 38 },
      ],
    };
  },
};
