import { Express } from "express";
import express from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  const publicPath = path.join(__dirname, "..", "dist", "public");
  
  if (!fs.existsSync(publicPath)) {
    throw new Error(`Public directory not found at ${publicPath}`);
  }

  app.use(express.static(publicPath));
  
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}
