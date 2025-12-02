import { Express } from "express";
import { createServer as createViteServer } from "vite";

export async function setupVite(app: Express) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });

  app.use(vite.middlewares);
}
