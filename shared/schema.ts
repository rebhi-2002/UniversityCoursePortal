import { pgTable, text, serial, integer, boolean, timestamp, json, foreignKey, varchar, unique, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role", { enum: ["student", "faculty", "admin"] }).notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
});

// Department model
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
});

export const insertDepartmentSchema = createInsertSchema(departments);

// Course model
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  credits: integer("credits").notNull(),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  instructorId: integer("instructor_id").references(() => users.id),
  capacity: integer("capacity").notNull(),
  deliveryMode: text("delivery_mode", { enum: ["in-person", "online", "hybrid"] }).notNull(),
  level: integer("level").notNull(),
  semester: text("semester").notNull(),
  year: integer("year").notNull(),
});

export const insertCourseSchema = createInsertSchema(courses);

// Schedule model
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  dayOfWeek: text("day_of_week", { enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] }).notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location").notNull(),
});

export const insertScheduleSchema = createInsertSchema(schedules);

// Enrollment model
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  status: text("status", { enum: ["registered", "waitlisted", "dropped"] }).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
}, (table) => {
  return {
    uniqueStudentCourse: unique().on(table.studentId, table.courseId),
  };
});

export const insertEnrollmentSchema = createInsertSchema(enrollments);

// Assignment model
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  totalPoints: integer("total_points").notNull(),
  moodleId: text("moodle_id"),
});

export const insertAssignmentSchema = createInsertSchema(assignments);

// Grade model
export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  score: integer("score").notNull(),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at"),
  gradedAt: timestamp("graded_at"),
}, (table) => {
  return {
    uniqueAssignmentStudent: unique().on(table.assignmentId, table.studentId),
  };
});

export const insertGradeSchema = createInsertSchema(grades);

// Notification model
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type", { enum: ["info", "warning", "error", "success"] }).notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications);

// Calendar Event model
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  type: text("type", { enum: ["deadline", "exam", "holiday", "other"] }).notNull(),
  courseId: integer("course_id").references(() => courses.id),
});

export const insertEventSchema = createInsertSchema(events);

// Moodle Integration model
export const moodleCourses = pgTable("moodle_courses", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id).unique(),
  moodleId: text("moodle_id").notNull().unique(),
  lastSynced: timestamp("last_synced"),
});

export const insertMoodleCourseSchema = createInsertSchema(moodleCourses);

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

export type Grade = typeof grades.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type MoodleCourse = typeof moodleCourses.$inferSelect;
export type InsertMoodleCourse = z.infer<typeof insertMoodleCourseSchema>;
