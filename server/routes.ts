import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertUserSchema, insertCourseSchema, insertEnrollmentSchema, insertAssignmentSchema, insertGradeSchema, insertNotificationSchema, insertEventSchema } from "@shared/schema";

// Helper middleware to ensure the user is authenticated
function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Helper middleware to check for specific role
function hasRole(role: string | string[]) {
  const roles = Array.isArray(role) ? role : [role];
  return (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // User routes
  app.get("/api/users", hasRole("admin"), async (req, res) => {
    try {
      const users = await storage.getCourses();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Department routes
  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { 
        departmentId, 
        level, 
        credits, 
        deliveryMode, 
        search,
        semester,
        year
      } = req.query;
      
      const filters = {
        departmentId: departmentId ? parseInt(departmentId as string) : undefined,
        level: level ? parseInt(level as string) : undefined,
        credits: credits ? parseInt(credits as string) : undefined,
        deliveryMode: deliveryMode as string,
        search: search as string,
        semester: semester as string,
        year: year ? parseInt(year as string) : undefined
      };
      
      const courses = await storage.getCourses(filters);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", hasRole("admin"), async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Schedule routes
  app.get("/api/courses/:id/schedules", async (req, res) => {
    try {
      const schedules = await storage.getCourseSchedules(parseInt(req.params.id));
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  // Enrollment routes
  app.get("/api/student/enrollments", ensureAuthenticated, async (req, res) => {
    try {
      const enrollments = await storage.getStudentEnrollments(req.user!.id);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/enrollments", ensureAuthenticated, async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        studentId: req.user!.id
      });
      
      // Check if user is already enrolled
      const existingEnrollment = await storage.getEnrollment(
        enrollmentData.studentId,
        enrollmentData.courseId
      );
      
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      // Check course capacity for waitlist status
      const course = await storage.getCourse(enrollmentData.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const courseEnrollments = await storage.getCourseEnrollments(enrollmentData.courseId);
      const registeredCount = courseEnrollments.filter(e => e.status === "registered").length;
      
      // Determine if the student should be waitlisted
      let status: "registered" | "waitlisted" | "dropped" = "registered";
      if (registeredCount >= course.capacity) {
        status = "waitlisted";
      }
      
      const enrollment = await storage.createEnrollment({
        ...enrollmentData,
        status
      });
      
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid enrollment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });

  app.put("/api/enrollments/:id/status", ensureAuthenticated, async (req, res) => {
    try {
      const { status } = req.body;
      if (!["registered", "waitlisted", "dropped"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedEnrollment = await storage.updateEnrollmentStatus(
        parseInt(req.params.id),
        status as "registered" | "waitlisted" | "dropped"
      );
      
      if (!updatedEnrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      
      res.json(updatedEnrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update enrollment status" });
    }
  });

  // Assignment routes
  app.get("/api/courses/:id/assignments", async (req, res) => {
    try {
      const assignments = await storage.getCourseAssignments(parseInt(req.params.id));
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post("/api/assignments", hasRole("faculty"), async (req, res) => {
    try {
      const assignmentData = insertAssignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  // Grade routes
  app.get("/api/student/grades", ensureAuthenticated, async (req, res) => {
    try {
      const grades = await storage.getStudentGrades(req.user!.id);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grades" });
    }
  });

  app.post("/api/grades", hasRole("faculty"), async (req, res) => {
    try {
      const gradeData = insertGradeSchema.parse(req.body);
      const grade = await storage.createGrade(gradeData);
      res.status(201).json(grade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid grade data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create grade" });
    }
  });

  // Notification routes
  app.get("/api/notifications", ensureAuthenticated, async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user!.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications/:id/read", ensureAuthenticated, async (req, res) => {
    try {
      const updatedNotification = await storage.markNotificationAsRead(parseInt(req.params.id));
      if (!updatedNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const { start, end, type, courseId } = req.query;
      
      const filters = {
        start: start ? new Date(start as string) : undefined,
        end: end ? new Date(end as string) : undefined,
        type: type as string,
        courseId: courseId ? parseInt(courseId as string) : undefined
      };
      
      const events = await storage.getEvents(filters);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events", hasRole(["admin", "faculty"]), async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // Setting up the HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
