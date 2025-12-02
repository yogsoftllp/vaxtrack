import { Express } from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { db } from "./db";

export async function setupAuth(app: Express) {
  app.use(
    session({
      store: new PrismaSessionStore(db, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
      }),
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
    })
  );

  // Signup endpoint
  app.post("/auth/signup", async (req: any, res) => {
    try {
      const { email, password, firstName } = req.body;

      if (!email || !password || !firstName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user exists
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Create user
      const user = await db.user.create({
        data: {
          email,
          firstName,
          role: "parent",
          country: "US", // Default
        },
      });

      // Set session
      req.session.user = { id: user.id, email: user.email, firstName: user.firstName };
      req.session.save((err: any) => {
        if (err) {
          return res.status(500).json({ error: "Session error" });
        }
        res.json({ message: "Signup successful", userId: user.id });
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  // Login endpoint
  app.post("/auth/login-form", async (req: any, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Find user
      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Simple password check (in production, use bcrypt)
      if (password !== "demo123" && email !== "demo@vaxtrack.com") {
        // Allow demo credentials, otherwise just accept (no real password hashing for MVP)
        if (password.length < 6) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      }

      // Set session
      req.session.user = { id: user.id, email: user.email, firstName: user.firstName };
      req.session.save((err: any) => {
        if (err) {
          return res.status(500).json({ error: "Session error" });
        }
        res.json({ message: "Login successful", userId: user.id });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/auth/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Pass user to routes
  app.use((req: any, res, next) => {
    if (req.session?.user) {
      (req as any).user = req.session.user;
    }
    next();
  });
}
