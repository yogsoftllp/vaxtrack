import { sql } from "drizzle-orm";
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

// Sessions table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone").unique(),
  role: varchar("role", { enum: ["parent", "clinic", "admin"] }).default("parent").notNull(),
  country: varchar("country"),
  city: varchar("city"),
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
  bloodType: varchar("blood_type"),
  allergies: text("allergies"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vaccination schedules
export const vaccinationSchedules = pgTable("vaccination_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  country: varchar("country").notNull(),
  vaccineName: varchar("vaccine_name").notNull(),
  vaccineCode: varchar("vaccine_code").notNull(),
  doseNumber: integer("dose_number").notNull(),
  ageInDays: integer("age_in_days").notNull(),
  ageDescription: varchar("age_description").notNull(),
  mandatory: boolean("mandatory").default(true),
});

// Vaccination records
export const vaccinationRecords = pgTable("vaccination_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  childId: varchar("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  scheduleId: varchar("schedule_id").references(() => vaccinationSchedules.id),
  vaccineName: varchar("vaccine_name").notNull(),
  doseNumber: integer("dose_number").notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  administeredDate: date("administered_date"),
  status: varchar("status", { enum: ["scheduled", "completed", "overdue", "skipped"] }).default("scheduled").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { enum: ["reminder", "appointment", "overdue", "system"] }).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertChildSchema = createInsertSchema(children).omit({ id: true, createdAt: true, updatedAt: true });
export const insertVaccinationRecordSchema = createInsertSchema(vaccinationRecords).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Child = typeof children.$inferSelect;
export type InsertChild = z.infer<typeof insertChildSchema>;
export type VaccinationRecord = typeof vaccinationRecords.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
