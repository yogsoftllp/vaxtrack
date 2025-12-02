import twilio from "twilio";
import { storage } from "./storage";

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER || "";

export interface NotificationPayload {
  userId: string;
  type: "reminder" | "overdue" | "appointment" | "system";
  title: string;
  message: string;
  phoneNumber?: string;
}

export class NotificationService {
  /**
   * Send SMS notification via Twilio
   */
  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    if (!twilioClient || !TWILIO_PHONE) {
      console.log("Twilio not configured. SMS would be sent to:", phoneNumber, message);
      return false;
    }

    try {
      await twilioClient.messages.create({
        body: message,
        from: TWILIO_PHONE,
        to: phoneNumber,
      });
      console.log("SMS sent to:", phoneNumber);
      return true;
    } catch (error) {
      console.error("Failed to send SMS:", error);
      return false;
    }
  }

  /**
   * Send web push notification (placeholder - requires client-side setup)
   */
  async sendPushNotification(userId: string, title: string, message: string): Promise<boolean> {
    try {
      // Store notification in database for web push delivery
      await storage.createNotification({
        userId,
        type: "reminder",
        title,
        message,
      });
      console.log("Push notification queued:", title);
      return true;
    } catch (error) {
      console.error("Failed to queue push notification:", error);
      return false;
    }
  }

  /**
   * Send in-app notification
   */
  async sendInAppNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      await storage.createNotification({
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
      });

      // Also send SMS if phone number provided and SMS enabled
      if (payload.phoneNumber) {
        const smsMessage = `VaxTrack: ${payload.title} - ${payload.message}`;
        await this.sendSMS(payload.phoneNumber, smsMessage);
      }

      return true;
    } catch (error) {
      console.error("Failed to send notification:", error);
      return false;
    }
  }

  /**
   * Send reminder for upcoming vaccination
   */
  async sendVaccinationReminder(
    userId: string,
    childName: string,
    vaccineName: string,
    scheduledDate: string,
    phoneNumber?: string
  ): Promise<boolean> {
    const date = new Date(scheduledDate).toLocaleDateString();
    const title = `Vaccine reminder for ${childName}`;
    const message = `${vaccineName} vaccination scheduled for ${date}. Please schedule an appointment if you haven't already.`;

    return this.sendInAppNotification({
      userId,
      type: "reminder",
      title,
      message,
      phoneNumber,
    });
  }

  /**
   * Send overdue notification
   */
  async sendOverdueNotification(
    userId: string,
    childName: string,
    vaccineName: string,
    daysOverdue: number,
    phoneNumber?: string
  ): Promise<boolean> {
    const title = `Overdue: ${childName}'s ${vaccineName}`;
    const message = `${vaccineName} is ${daysOverdue} days overdue. Please schedule an appointment immediately to keep ${childName} protected.`;

    return this.sendInAppNotification({
      userId,
      type: "overdue",
      title,
      message,
      phoneNumber,
    });
  }
}

export const notificationService = new NotificationService();
