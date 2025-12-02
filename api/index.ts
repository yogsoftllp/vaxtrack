import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/static";

let app: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = express();
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    
    process.env.NODE_ENV = "production";
    
    // Register API routes
    await registerRoutes(null, app);
    
    // Serve static frontend files
    serveStatic(app);
  }

  app(req, res);
}
