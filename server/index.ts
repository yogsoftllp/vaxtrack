import { initializeApp, httpServer } from "./app";

(async () => {
  await initializeApp();

  // Only start listening in development or non-serverless environments
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    const { setupVite } = await import("./vite");
    const app = (await initializeApp()).use;

    if (process.env.NODE_ENV === "development") {
      const app = (await initializeApp());
      await setupVite(httpServer, app);
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        console.log(`serving on port ${port}`);
      },
    );
  }
})();
