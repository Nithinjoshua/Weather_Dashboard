import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mongoose from "mongoose";
import weatherRouter from "./routes/weather.routes.js";
import authRouter from "./routes/auth.routes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

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

app.use("/api/auth", authRouter);
app.use("/api/weather", weatherRouter);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    error: err.message || "Something went wrong.",
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
