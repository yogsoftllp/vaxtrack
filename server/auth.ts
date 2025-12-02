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

  // Mock auth endpoints
  app.get("/auth/login", (req: any, res) => {
    req.session.user = { id: "test-user-1", firstName: "Test User" };
    req.session.save(() => res.redirect("/"));
  });

  app.get("/auth/logout", (req: any, res) => {
    req.session.destroy(() => res.redirect("/"));
  });

  // Pass user to routes
  app.use((req: any, res, next) => {
    if (req.session?.user) {
      (req as any).user = req.session.user;
    }
    next();
  });
}
