import { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";

export function registerRoutes(app: Express) {
  // Auth user
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const user = await storage.getUser(req.user.id);
      res.json(user || { id: req.user.id, firstName: req.user.firstName });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const stats = await storage.getDashboardStats(req.user.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Children list
  app.get("/api/children", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const childrenList = await storage.getChildren(req.user.id);
      res.json(childrenList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch children" });
    }
  });

  // Add child
  app.post("/api/children", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const { firstName, lastName, dateOfBirth, gender, country } = req.body;
      const child = await storage.addChild(req.user.id, {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        country,
      });
      res.json(child);
    } catch (error) {
      res.status(400).json({ error: "Invalid child data" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req: any, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const notifs = await storage.getNotifications(req.user.id);
      res.json(notifs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });
}
