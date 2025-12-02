import { Express } from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";

export async function setupAuth(app: Express) {
  const pgSession = ConnectPgSimple(session);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  app.use(
    session({
      store: new pgSession({ pool }),
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true },
    })
  );

  // Mock auth middleware - replace with Replit Auth later
  app.get("/auth/login", (req: any, res) => {
    req.session.user = { id: "test-user", firstName: "Test" };
    res.redirect("/");
  });

  app.get("/auth/logout", (req: any, res) => {
    req.session.user = null;
    res.redirect("/");
  });

  app.use((req: any, res, next) => {
    if (req.session?.user) {
      res.setHeader("x-user-id", req.session.user.id);
    }
    next();
  });
}
