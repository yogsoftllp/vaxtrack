import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Support both Vercel Postgres and Replit Postgres
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or POSTGRES_URL_NON_POOLING is required");
}

const client = postgres(databaseUrl);
export const db = drizzle(client);
