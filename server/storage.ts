import { 
  User, 
  InsertUser, 
  Course, 
  InsertCourse, 
  Department, 
  InsertDepartment,
  Schedule,
  InsertSchedule,
  Enrollment,
  InsertEnrollment,
  Assignment,
  InsertAssignment,
  Grade,
  InsertGrade,
  Notification,
  InsertNotification,
  Event,
  InsertEvent,
  MoodleCourse,
  InsertMoodleCourse,
  users,
  courses,
  departments,
  schedules,
  enrollments,
  assignments,
  grades,
  notifications,
  events,
  moodleCourses
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, or, like, gte, lte, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Course operations
  getCourse(id: number): Promise<Course | undefined>;
  getCourseByCode(code: string): Promise<Course | undefined>;
  getCourses(filters?: CourseFilters): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  
  // Department operations
  getDepartment(id: number): Promise<Department | undefined>;
  getDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Schedule operations
  getCourseSchedules(courseId: number): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  
  // Enrollment operations
  getEnrollment(studentId: number, courseId: number): Promise<Enrollment | undefined>;
  getStudentEnrollments(studentId: number): Promise<Enrollment[]>;
  getCourseEnrollments(courseId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentStatus(id: number, status: "registered" | "waitlisted" | "dropped"): Promise<Enrollment | undefined>;
  
  // Assignment operations
  getAssignment(id: number): Promise<Assignment | undefined>;
  getCourseAssignments(courseId: number): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  
  // Grade operations
  getStudentGrades(studentId: number): Promise<Grade[]>;
  getAssignmentGrades(assignmentId: number): Promise<Grade[]>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: number, score: number, feedback?: string): Promise<Grade | undefined>;
  
  // Notification operations
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Event operations
  getEvents(filters?: EventFilters): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Moodle operations
  getMoodleCourse(courseId: number): Promise<MoodleCourse | undefined>;
  createMoodleCourse(moodleCourse: InsertMoodleCourse): Promise<MoodleCourse>;

  // Session store
  sessionStore: any; // Using any for now to resolve type error
}

export interface CourseFilters {
  departmentId?: number;
  level?: number;
  credits?: number;
  deliveryMode?: string;
  search?: string;
  semester?: string;
  year?: number;
}

export interface EventFilters {
  start?: Date;
  end?: Date;
  type?: string;
  courseId?: number;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCourseByCode(code: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.code, code));
    return course;
  }

  async getCourses(filters?: CourseFilters): Promise<Course[]> {
    let query = db.select().from(courses);

    if (filters) {
      const conditions = [];

      if (filters.departmentId) {
        conditions.push(eq(courses.departmentId, filters.departmentId));
      }

      if (filters.level) {
        conditions.push(eq(courses.level, filters.level));
      }

      if (filters.credits) {
        conditions.push(eq(courses.credits, filters.credits));
      }

      if (filters.deliveryMode) {
        conditions.push(eq(courses.deliveryMode, filters.deliveryMode));
      }

      if (filters.semester) {
        conditions.push(eq(courses.semester, filters.semester));
      }

      if (filters.year) {
        conditions.push(eq(courses.year, filters.year));
      }

      if (filters.search) {
        const searchPattern = `%${filters.search}%`;
        conditions.push(
          or(
            like(courses.code, searchPattern),
            like(courses.title, searchPattern),
            like(courses.description, searchPattern)
          )
        );
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }

    return await query;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values(insertCourse)
      .returning();
    return course;
  }

  async updateCourse(id: number, courseData: Partial<InsertCourse>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set(courseData)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  // Department methods
  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department;
  }

  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments).orderBy(departments.code);
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const [department] = await db
      .insert(departments)
      .values(insertDepartment)
      .returning();
    return department;
  }

  // Schedule methods
  async getCourseSchedules(courseId: number): Promise<Schedule[]> {
    return await db.select().from(schedules).where(eq(schedules.courseId, courseId));
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const [schedule] = await db
      .insert(schedules)
      .values(insertSchedule)
      .returning();
    return schedule;
  }

  // Enrollment methods
  async getEnrollment(studentId: number, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, studentId),
          eq(enrollments.courseId, courseId)
        )
      );
    return enrollment;
  }

  async getStudentEnrollments(studentId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId));
  }

  async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db
      .insert(enrollments)
      .values(insertEnrollment)
      .returning();
    return enrollment;
  }

  async updateEnrollmentStatus(
    id: number,
    status: "registered" | "waitlisted" | "dropped"
  ): Promise<Enrollment | undefined> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({ status })
      .where(eq(enrollments.id, id))
      .returning();
    return updatedEnrollment;
  }

  // Assignment methods
  async getAssignment(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment;
  }

  async getCourseAssignments(courseId: number): Promise<Assignment[]> {
    return await db
      .select()
      .from(assignments)
      .where(eq(assignments.courseId, courseId))
      .orderBy(assignments.dueDate);
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const [assignment] = await db
      .insert(assignments)
      .values(insertAssignment)
      .returning();
    return assignment;
  }

  // Grade methods
  async getStudentGrades(studentId: number): Promise<Grade[]> {
    return await db.select().from(grades).where(eq(grades.studentId, studentId));
  }

  async getAssignmentGrades(assignmentId: number): Promise<Grade[]> {
    return await db.select().from(grades).where(eq(grades.assignmentId, assignmentId));
  }

  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const [grade] = await db
      .insert(grades)
      .values(insertGrade)
      .returning();
    return grade;
  }

  async updateGrade(id: number, score: number, feedback?: string): Promise<Grade | undefined> {
    const [updatedGrade] = await db
      .update(grades)
      .set({
        score,
        feedback,
        gradedAt: new Date(),
      })
      .where(eq(grades.id, id))
      .returning();
    return updatedGrade;
  }

  // Notification methods
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }

  // Event methods
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    let query = db.select().from(events);

    if (filters) {
      const conditions = [];

      if (filters.start) {
        conditions.push(gte(events.startDate, filters.start));
      }

      if (filters.end) {
        conditions.push(lte(events.endDate, filters.end));
      }

      if (filters.type) {
        conditions.push(eq(events.type, filters.type));
      }

      if (filters.courseId) {
        conditions.push(eq(events.courseId, filters.courseId));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }

    return await query.orderBy(events.startDate);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  // Moodle methods
  async getMoodleCourse(courseId: number): Promise<MoodleCourse | undefined> {
    const [moodleCourse] = await db
      .select()
      .from(moodleCourses)
      .where(eq(moodleCourses.courseId, courseId));
    return moodleCourse;
  }

  async createMoodleCourse(insertMoodleCourse: InsertMoodleCourse): Promise<MoodleCourse> {
    const [moodleCourse] = await db
      .insert(moodleCourses)
      .values(insertMoodleCourse)
      .returning();
    return moodleCourse;
  }
}

export const storage = new DatabaseStorage();
