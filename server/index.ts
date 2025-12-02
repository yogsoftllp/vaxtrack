import express from "express";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";
import { serveStatic } from "./static";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  try {
    await setupAuth(app);
    registerRoutes(app);

    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      try {
        const { setupVite } = await import("./vite-dev");
        await setupVite(app);
      } catch (e) {
        console.log("Vite setup skipped, using static files");
        serveStatic(app);
      }
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
