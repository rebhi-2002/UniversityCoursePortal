import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Function to create test users on startup
import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestUsers() {
  try {
    // Create student account if it doesn't exist
    const existingStudent = await storage.getUserByUsername("student");
    if (!existingStudent) {
      const studentUser = await storage.createUser({
        username: "student",
        email: "student@university.edu",
        password: await hashPassword("password123"),
        firstName: "Sample",
        lastName: "Student",
        role: "student"
      });
      console.log("Created student account:", studentUser.username);
    }
    
    // Create faculty account if it doesn't exist
    const existingFaculty = await storage.getUserByUsername("faculty");
    if (!existingFaculty) {
      const facultyUser = await storage.createUser({
        username: "faculty",
        email: "faculty@university.edu",
        password: await hashPassword("password123"),
        firstName: "Sample",
        lastName: "Faculty",
        role: "faculty"
      });
      console.log("Created faculty account:", facultyUser.username);
    }
    
    // Create admin account if it doesn't exist
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      const adminUser = await storage.createUser({
        username: "admin",
        email: "admin@university.edu",
        password: await hashPassword("password123"),
        firstName: "Sample",
        lastName: "Admin",
        role: "admin"
      });
      console.log("Created admin account:", adminUser.username);
    }
    
    console.log("Test users setup complete!");
  } catch (error) {
    console.error("Error creating test users:", error);
  }
}

(async () => {
  // Create test users first
  await createTestUsers();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
