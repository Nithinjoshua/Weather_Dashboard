import { Router } from "express";

import {
  getCurrentWeather,
  getForecast,
  getHistory,
  getSearchSuggestions,
} from "../controllers/weather.controller.js";

const router = Router();

router.get("/current", getCurrentWeather);
router.get("/forecast", getForecast);
router.get("/history", getHistory);
router.get("/search", getSearchSuggestions);

export default router;
