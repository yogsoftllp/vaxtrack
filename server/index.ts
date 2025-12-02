import express from "express";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "VaxTrack API - Starting fresh" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
