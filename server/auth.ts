import { Express } from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING;

export async function setupAuth(app: Express) {
  const pgSession = ConnectPgSimple(session);
  
  // Use Neon pool for Replit, or create connection for Vercel
  let pool: any;
  if (process.env.DATABASE_URL?.includes("neon")) {
    pool = new Pool({ connectionString: databaseUrl });
  } else {
    // Vercel Postgres - create a simple pool-like object
    const client = postgres(databaseUrl || "");
    pool = client;
  }

  app.use(
    session({
      store: new pgSession({ pool }),
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true },
    })
  );

  // Mock auth middleware
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
