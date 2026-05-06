import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import weatherRouter from "./routes/weather.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Weather Dashboard backend is running.",
    weatherApiConfigured: Boolean(process.env.WEATHER_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/weather", weatherRouter);

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    error: err.message || "Something went wrong.",
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
