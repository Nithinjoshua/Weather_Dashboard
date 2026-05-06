import {
  fetchCurrentWeather,
  fetchForecast,
  fetchHistory,
  fetchSuggestions,
} from "../services/weather.service.js";

export async function getCurrentWeather(req, res, next) {
  try {
    const city = req.query.city || "Chennai";
    const units = req.query.units || "metric";
    const weather = await fetchCurrentWeather(city, units);

    res.json(weather);
  } catch (error) {
    next(error);
  }
}

export async function getForecast(req, res, next) {
  try {
    const city = req.query.city || "Chennai";
    const units = req.query.units || "metric";
    const forecast = await fetchForecast(city, units);

    res.json(forecast);
  } catch (error) {
    next(error);
  }
}

export async function getHistory(req, res, next) {
  try {
    const city = req.query.city || "Chennai";
    const units = req.query.units || "metric";
    const history = await fetchHistory(city, units);

    res.json(history);
  } catch (error) {
    next(error);
  }
}

export async function getSearchSuggestions(req, res, next) {
  try {
    const query = req.query.q || "";
    const suggestions = await fetchSuggestions(query);

    res.json({ query, suggestions });
  } catch (error) {
    next(error);
  }
}
