import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone").unique(),
  role: varchar("role", { enum: ["parent", "clinic", "admin", "superadmin"] }).default("parent").notNull(),
  subscriptionTier: varchar("subscription_tier", { enum: ["free", "family", "clinic"] }).default("free").notNull(),
  authProvider: varchar("auth_provider", { enum: ["google", "phone", "whatsapp", "replit"] }).default("replit"),
  referralCode: varchar("referral_code").unique(),
  referredById: varchar("referred_by_id").references(() => users.id, { onDelete: "set null" }),
  successfulReferrals: integer("successful_referrals").default(0),
  country: varchar("country"),
  city: varchar("city"),
  clinicVerificationStatus: varchar("clinic_verification_status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
  clinicVerificationNotes: text("clinic_verification_notes"),
  clinicVerifiedBy: varchar("clinic_verified_by").references(() => users.id, { onDelete: "set null" }),
  clinicVerifiedAt: timestamp("clinic_verified_at"),
  notificationPreferences: jsonb("notification_preferences").$type<{
    sms: boolean;
    push: boolean;
    email: boolean;
    reminderDays: number[];
  }>().default({ sms: true, push: true, email: true, reminderDays: [7, 3, 1] }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Children table
export const children = pgTable("children", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name"),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: varchar("gender", { enum: ["male", "female", "other"] }),
  country: varchar("country").notNull(),
  city: varchar("city"),
  bloodType: varchar("blood_type"),
  allergies: text("allergies"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vaccination schedules by country (reference data)
export const vaccinationSchedules = pgTable("vaccination_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  country: varchar("country").notNull(),
  vaccineName: varchar("vaccine_name").notNull(),
  vaccineCode: varchar("vaccine_code").notNull(),
  doseNumber: integer("dose_number").notNull(),
  ageInDays: integer("age_in_days").notNull(),
  ageDescription: varchar("age_description").notNull(),
  mandatory: boolean("mandatory").default(true),
  description: text("description"),
  sideEffects: text("side_effects"),
});

// Child vaccination records
export const vaccinationRecords = pgTable("vaccination_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  childId: varchar("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  scheduleId: varchar("schedule_id").references(() => vaccinationSchedules.id),
  vaccineName: varchar("vaccine_name").notNull(),
  vaccineCode: varchar("vaccine_code"),
  doseNumber: integer("dose_number").notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  administeredDate: date("administered_date"),
  status: varchar("status", { enum: ["scheduled", "completed", "overdue", "skipped"] }).default("scheduled").notNull(),
  clinicId: varchar("clinic_id").references(() => clinics.id),
  administeredBy: varchar("administered_by"),
  batchNumber: varchar("batch_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clinics table
export const clinics = pgTable("clinics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  address: text("address"),
  city: varchar("city"),
  country: varchar("country"),
  phone: varchar("phone"),
  email: varchar("email"),
  website: varchar("website"),
  customDomain: varchar("custom_domain").unique(),
  subscriptionTier: varchar("subscription_tier", { enum: ["free", "family", "clinic"] }).default("free").notNull(),
  operatingHours: jsonb("operating_hours").$type<{
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  }>(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  childId: varchar("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  clinicId: varchar("clinic_id").references(() => clinics.id),
  vaccinationRecordId: varchar("vaccination_record_id").references(() => vaccinationRecords.id),
  slotId: varchar("slot_id").references(() => appointmentSlots.id),
  scheduledDateTime: timestamp("scheduled_date_time").notNull(),
  status: varchar("status", { enum: ["scheduled", "confirmed", "completed", "cancelled", "no_show"] }).default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointment slots table - for clinic slot management
export const appointmentSlots = pgTable("appointment_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  startTime: varchar("start_time").notNull(), // HH:mm format
  endTime: varchar("end_time").notNull(), // HH:mm format
  capacity: integer("capacity").default(1).notNull(), // Number of appointments this slot can accommodate
  booked: integer("booked").default(0).notNull(), // Current number of bookings
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { enum: ["reminder", "appointment", "overdue", "system"] }).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  actionUrl: varchar("action_url"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  sentViaSms: boolean("sent_via_sms").default(false),
  sentViaPush: boolean("sent_via_push").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Push subscription table
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  keys: jsonb("keys").$type<{ p256dh: string; auth: string }>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Global system configuration (SMS, Payment, Feature toggles)
export const systemConfiguration = pgTable("system_configuration", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  smsProvider: varchar("sms_provider", { enum: ["twilio", "firebase"] }).default("twilio"),
  smsApiKey: varchar("sms_api_key"),
  smsApiSecret: varchar("sms_api_secret"),
  smsSenderId: varchar("sms_sender_id"),
  pushProvider: varchar("push_provider", { enum: ["web", "firebase", "onesignal"] }).default("firebase"),
  pushApiKey: varchar("push_api_key"),
  paymentProvider: varchar("payment_provider", { enum: ["stripe", "razorpay", "paypal"] }).default("stripe"),
  paymentApiKey: varchar("payment_api_key"),
  paymentApiSecret: varchar("payment_api_secret"),
  featuresEnabled: jsonb("features_enabled").$type<{
    smsNotifications: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
    payments: boolean;
    vaccinationCertificates: boolean;
    multiChild: boolean;
    clinicDashboard: boolean;
    analytics: boolean;
  }>().default({
    smsNotifications: true,
    pushNotifications: true,
    emailNotifications: true,
    payments: false,
    vaccinationCertificates: false,
    multiChild: true,
    clinicDashboard: true,
    analytics: true,
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clinic-specific branding and configuration
export const clinicBranding = pgTable("clinic_branding", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  logoUrl: varchar("logo_url"),
  primaryColor: varchar("primary_color").default("#1f2937"),
  secondaryColor: varchar("secondary_color").default("#3b82f6"),
  loginPageText: text("login_page_text"),
  dashboardTitle: varchar("dashboard_title"),
  reportFooterText: text("report_footer_text"),
  featuresEnabled: jsonb("features_enabled").$type<{
    smsNotifications: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
    payments: boolean;
    bulkVaccinationUpdate: boolean;
  }>().default({
    smsNotifications: true,
    pushNotifications: true,
    emailNotifications: true,
    payments: false,
    bulkVaccinationUpdate: true,
  }),
  customSmsProvider: varchar("custom_sms_provider", { enum: ["twilio", "firebase"] }),
  customSmsApiKey: varchar("custom_sms_api_key"),
  customPaymentProvider: varchar("custom_payment_provider", { enum: ["stripe", "razorpay", "paypal"] }),
  customPaymentApiKey: varchar("custom_payment_api_key"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User-Clinic Association (Multi-clinic support)
export const userClinicAssociation = pgTable("user_clinic_association", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  role: varchar("role", { enum: ["owner", "admin", "doctor", "staff"] }).default("owner").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Landing Page Branding (Superadmin customization for parent landing page)
export const landingPageBranding = pgTable("landing_page_branding", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  logoUrl: varchar("logo_url"),
  headerText: varchar("header_text").default("VaxTrack"),
  headerDescription: text("header_description").default("Smart vaccination management for parents and clinics worldwide"),
  primaryColor: varchar("primary_color").default("#3b82f6"),
  secondaryColor: varchar("secondary_color").default("#1f2937"),
  footerText: text("footer_text"),
  featuredImageUrl: varchar("featured_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vaccine pricing by clinic
export const vaccinePricing = pgTable("vaccine_pricing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  vaccineCode: varchar("vaccine_code").notNull(),
  vaccineName: varchar("vaccine_name").notNull(),
  price: integer("price").notNull(), // Price in cents for precision
  currency: varchar("currency").default("USD"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clinic advertisements (for free-plan clinics)
export const clinicAdvertisements = pgTable("clinic_advertisements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clinicId: varchar("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  bannerImageUrl: varchar("banner_image_url"),
  ctaText: varchar("cta_text").default("Book Now"),
  ctaLink: varchar("cta_link"),
  highlightText: varchar("highlight_text"), // e.g., "Free consultation"
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Referral tracking table
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  referredUserId: varchar("referred_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { enum: ["pending", "completed"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// OTP storage for phone authentication
export const phoneOtps = pgTable("phone_otps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar("phone").notNull(),
  otp: varchar("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// SMS provider configuration for superadmin
export const smsProviderConfig = pgTable("sms_provider_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: varchar("provider", { enum: ["twilio", "firebase"] }).default("firebase").notNull(),
  twilioAccountSid: varchar("twilio_account_sid"),
  twilioAuthToken: varchar("twilio_auth_token"),
  twilioPhoneNumber: varchar("twilio_phone_number"),
  twilioWhatsappNumber: varchar("twilio_whatsapp_number"),
  firebaseProjectId: varchar("firebase_project_id"),
  firebasePrivateKey: text("firebase_private_key"),
  firebaseClientEmail: varchar("firebase_client_email"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  children: many(children),
  notifications: many(notifications),
  pushSubscriptions: many(pushSubscriptions),
  clinicAssociations: many(userClinicAssociation),
}));

export const clinicsRelations2 = relations(clinics, ({ one, many }) => ({
  branding: one(clinicBranding),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  user: one(users, { fields: [children.userId], references: [users.id] }),
  vaccinationRecords: many(vaccinationRecords),
  appointments: many(appointments),
}));

export const vaccinationRecordsRelations = relations(vaccinationRecords, ({ one }) => ({
  child: one(children, { fields: [vaccinationRecords.childId], references: [children.id] }),
  schedule: one(vaccinationSchedules, { fields: [vaccinationRecords.scheduleId], references: [vaccinationSchedules.id] }),
  clinic: one(clinics, { fields: [vaccinationRecords.clinicId], references: [clinics.id] }),
}));

export const clinicsRelations = relations(clinics, ({ many }) => ({
  vaccinationRecords: many(vaccinationRecords),
  appointments: many(appointments),
  userAssociations: many(userClinicAssociation),
}));

export const userClinicAssociationRelations = relations(userClinicAssociation, ({ one }) => ({
  user: one(users, { fields: [userClinicAssociation.userId], references: [users.id] }),
  clinic: one(clinics, { fields: [userClinicAssociation.clinicId], references: [clinics.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  child: one(children, { fields: [appointments.childId], references: [children.id] }),
  clinic: one(clinics, { fields: [appointments.clinicId], references: [clinics.id] }),
  vaccinationRecord: one(vaccinationRecords, { fields: [appointments.vaccinationRecordId], references: [vaccinationRecords.id] }),
  slot: one(appointmentSlots, { fields: [appointments.slotId], references: [appointmentSlots.id] }),
}));

export const appointmentSlotsRelations = relations(appointmentSlots, ({ one, many }) => ({
  clinic: one(clinics, { fields: [appointmentSlots.clinicId], references: [clinics.id] }),
  appointments: many(appointments),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChildSchema = createInsertSchema(children).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVaccinationScheduleSchema = createInsertSchema(vaccinationSchedules).omit({
  id: true,
});

export const insertVaccinationRecordSchema = createInsertSchema(vaccinationRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClinicSchema = createInsertSchema(clinics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSlotSchema = createInsertSchema(appointmentSlots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClinicAdvertisementSchema = createInsertSchema(clinicAdvertisements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  impressions: true,
  clicks: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertPhoneOtpSchema = createInsertSchema(phoneOtps).omit({
  id: true,
  createdAt: true,
});

export const insertSmsProviderConfigSchema = createInsertSchema(smsProviderConfig).omit({
  id: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Child = typeof children.$inferSelect;
export type InsertChild = z.infer<typeof insertChildSchema>;

export type VaccinationSchedule = typeof vaccinationSchedules.$inferSelect;
export type InsertVaccinationSchedule = z.infer<typeof insertVaccinationScheduleSchema>;

export type VaccinationRecord = typeof vaccinationRecords.$inferSelect;
export type InsertVaccinationRecord = z.infer<typeof insertVaccinationRecordSchema>;

export type Clinic = typeof clinics.$inferSelect;
export type InsertClinic = z.infer<typeof insertClinicSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type AppointmentSlot = typeof appointmentSlots.$inferSelect;
export type InsertAppointmentSlot = z.infer<typeof insertAppointmentSlotSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type ClinicAdvertisement = typeof clinicAdvertisements.$inferSelect;
export type InsertClinicAdvertisement = z.infer<typeof insertClinicAdvertisementSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type PhoneOtp = typeof phoneOtps.$inferSelect;
export type InsertPhoneOtp = z.infer<typeof insertPhoneOtpSchema>;
export type SmsProviderConfig = typeof smsProviderConfig.$inferSelect;
export type InsertSmsProviderConfig = z.infer<typeof insertSmsProviderConfigSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;

export type SystemConfiguration = typeof systemConfiguration.$inferSelect;
export type ClinicBranding = typeof clinicBranding.$inferSelect;

// Insert schemas
export const insertSystemConfigurationSchema = createInsertSchema(systemConfiguration).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClinicBrandingSchema = createInsertSchema(clinicBranding).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserClinicAssociationSchema = createInsertSchema(userClinicAssociation).omit({
  id: true,
  createdAt: true,
});

export const insertLandingPageBrandingSchema = createInsertSchema(landingPageBranding).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVaccinePricingSchema = createInsertSchema(vaccinePricing).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSystemConfiguration = z.infer<typeof insertSystemConfigurationSchema>;
export type InsertClinicBranding = z.infer<typeof insertClinicBrandingSchema>;
export type InsertUserClinicAssociation = z.infer<typeof insertUserClinicAssociationSchema>;
export type InsertLandingPageBranding = z.infer<typeof insertLandingPageBrandingSchema>;
export type InsertVaccinePricing = z.infer<typeof insertVaccinePricingSchema>;
export type LandingPageBranding = typeof landingPageBranding.$inferSelect;
export type UserClinicAssociation = typeof userClinicAssociation.$inferSelect;
export type VaccinePricing = typeof vaccinePricing.$inferSelect;
