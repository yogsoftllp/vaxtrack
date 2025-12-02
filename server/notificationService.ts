import twilio from "twilio";
import { storage } from "./storage";
import nodemailer from "nodemailer";

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER || "";

// Setup email transporter (will use environment variables for SMTP config)
const emailTransporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    })
  : null;

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
   * Send email notification
   */
  async sendEmail(email: string, subject: string, message: string): Promise<boolean> {
    if (!emailTransporter) {
      console.log("Email not configured. Would send to:", email, subject);
      return false;
    }

    try {
      await emailTransporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@vaxtrack.com",
        to: email,
        subject: `VaxTrack: ${subject}`,
        html: `<p>${message}</p>`,
      });
      console.log("Email sent to:", email);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  /**
   * Send in-app notification
   */
  async sendInAppNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      const notification = await storage.createNotification({
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
      });

      // Also send SMS if phone number provided and SMS enabled
      if (payload.phoneNumber) {
        const smsMessage = `VaxTrack: ${payload.title} - ${payload.message}`;
        await this.sendSMS(payload.phoneNumber, smsMessage);
        await storage.updateNotification(notification.id, { sentViaSms: true });
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

  /**
   * Send appointment confirmation
   */
  async sendAppointmentConfirmation(
    userId: string,
    email: string | undefined,
    childName: string,
    vaccineName: string,
    appointmentDate: string,
    clinicName: string
  ): Promise<boolean> {
    const title = `Appointment confirmed for ${childName}`;
    const message = `Your appointment for ${vaccineName} is confirmed on ${appointmentDate} at ${clinicName}.`;

    const inAppSent = await this.sendInAppNotification({
      userId,
      type: "appointment",
      title,
      message,
    });

    if (email) {
      await this.sendEmail(
        email,
        title,
        `${message} Please arrive 10 minutes early.`
      );
    }

    return inAppSent;
  }
}

export const notificationService = new NotificationService();
