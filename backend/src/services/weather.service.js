// Live Weather Provider: OpenWeatherMap
const LIVE_BASE_URL =
  process.env.WEATHER_API_BASE_URL || "https://api.openweathermap.org/data/2.5";

const GEO_BASE_URL =
  process.env.WEATHER_GEO_BASE_URL || "https://api.openweathermap.org/geo/1.0";

// Previous week/history remains unchanged (archive provider)
const ARCHIVE_BASE_URL =
  process.env.WEATHER_ARCHIVE_BASE_URL || "https://archive-api.open-meteo.com/v1/archive";

const mockCities = [
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Mumbai",
  "Delhi",
  "Kolkata",
  "New York",
  "London",
  "Tokyo",
  "Sydney",
];

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function requireApiKey() {
  if (!process.env.WEATHER_API_KEY) {
    throw createHttpError(
      "Weather API key is missing. Add WEATHER_API_KEY to backend/.env and restart the backend.",
      500,
    );
  }
}

function buildMockCurrent(city, units) {
  const isMetric = units === "metric";

  return {
    source: "mock",
    city,
    country: "IN",
    units,
    current: {
      temperature: isMetric ? 31 : 87.8,
      feelsLike: isMetric ? 35 : 95,
      condition: "Cloudy",
      description: "Warm breeze with broken clouds",
      humidity: 72,
      windSpeed: isMetric ? 18 : 11.2,
      windDirection: "SE",
      visibility: 8,
      pressure: 1008,
      uvIndex: 8,
      airQualityIndex: 63,
      dewPoint: isMetric ? 24 : 75.2,
      cloudCoverage: 68,
      sunrise: "06:01 AM",
      sunset: "06:27 PM",
      icon: "cloudy",
      updatedAt: new Date().toISOString(),
    },
    highlights: [
      { label: "Humidity", value: "72%" },
      { label: "Wind", value: isMetric ? "18 km/h" : "11.2 mph" },
      { label: "Visibility", value: "8 km" },
      { label: "AQI", value: "63" },
    ],
  };
}

function buildMockForecast(city, units) {
  const isMetric = units === "metric";

  return {
    source: "mock",
    city,
    units,
    hourly: [
      { time: "Now", temp: isMetric ? 31 : 87.8, rainChance: 20 },
      { time: "1 PM", temp: isMetric ? 32 : 89.6, rainChance: 18 },
      { time: "2 PM", temp: isMetric ? 33 : 91.4, rainChance: 15 },
      { time: "3 PM", temp: isMetric ? 33 : 91.4, rainChance: 12 },
      { time: "4 PM", temp: isMetric ? 32 : 89.6, rainChance: 24 },
      { time: "5 PM", temp: isMetric ? 31 : 87.8, rainChance: 35 },
    ],
    daily: [
      { day: "Thu", high: isMetric ? 33 : 91.4, low: isMetric ? 27 : 80.6, condition: "Cloudy", sunrise: "06:01", sunset: "18:27" },
      { day: "Fri", high: isMetric ? 34 : 93.2, low: isMetric ? 27 : 80.6, condition: "Sunny", sunrise: "06:00", sunset: "18:27" },
      { day: "Sat", high: isMetric ? 32 : 89.6, low: isMetric ? 26 : 78.8, condition: "Rain", sunrise: "06:00", sunset: "18:28" },
      { day: "Sun", high: isMetric ? 31 : 87.8, low: isMetric ? 26 : 78.8, condition: "Storm", sunrise: "05:59", sunset: "18:28" },
      { day: "Mon", high: isMetric ? 33 : 91.4, low: isMetric ? 27 : 80.6, condition: "Cloudy", sunrise: "05:59", sunset: "18:28" },
      { day: "Tue", high: isMetric ? 34 : 93.2, low: isMetric ? 28 : 82.4, condition: "Sunny", sunrise: "05:58", sunset: "18:29" },
      { day: "Wed", high: isMetric ? 32 : 89.6, low: isMetric ? 27 : 80.6, condition: "Rain", sunrise: "05:58", sunset: "18:29" },
    ],
  };
}

async function fetchFromOpenWeather(baseUrl, endpoint, params) {
  requireApiKey();
  const apiKey = process.env.WEATHER_API_KEY;

  const url = new URL(`${baseUrl}${endpoint}`);
  Object.entries({ ...params, appid: apiKey }).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  });

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw createHttpError("City not found. Try another location.", 404);
    }

    if (response.status === 401) {
      throw createHttpError(
        "Weather API key is invalid. Update WEATHER_API_KEY in backend/.env and restart the backend.",
        401,
      );
    }

    throw createHttpError("Failed to fetch weather data from provider.", response.status);
  }

  return response.json();
}

async function fetchOpenWeatherCitySuggestions(query) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const data = await fetchFromOpenWeather(GEO_BASE_URL, "/direct", {
      q: query,
      limit: 5,
    });

    if (!Array.isArray(data) || data.length === 0) return null;

    return data.map((entry) => {
      const city = entry?.name || "";
      const country = entry?.country || "";
      const state = entry?.state ? `, ${entry.state}` : "";
      return `${city}${state}, ${country}`.replace(/\s+/g, " ").trim();
    });
  } catch {
    return null;
  }
}

async function fetchCoordinatesForHistory(city) {
  const data = await fetchFromOpenWeather(GEO_BASE_URL, "/direct", {
    q: city,
    limit: 1,
  });

  if (!Array.isArray(data) || data.length === 0) {
    throw createHttpError("City not found. Try another location.", 404);
  }

  const entry = data[0];
  return {
    name: entry.name,
    country: entry.country,
    lat: entry.lat,
    lon: entry.lon,
  };
}

function formatHistoryResponse(cityMatch, daily, units) {
  const entries = daily.time.map((date, index) => ({
    date,
    day: new Date(date).toLocaleDateString([], { weekday: "short" }),
    high: daily.temperature_2m_max[index],
    low: daily.temperature_2m_min[index],
    rain: daily.precipitation_sum[index],
    windSpeed: daily.wind_speed_10m_max[index],
    weatherCode: daily.weather_code[index],
  }));

  return {
    city: cityMatch.name,
    country: cityMatch.country,
    units,
    entries,
  };
}

export async function fetchCurrentWeather(city, units) {
  try {
    const data = await fetchFromOpenWeather(LIVE_BASE_URL, "/weather", {
      q: city,
      units: units,
    });

    return {
      source: "live",
      city: data.name,
      country: data.sys?.country || "",
      units,
      current: {
        temperature: data.main?.temp,
        feelsLike: data.main?.feels_like,
        condition: data.weather?.[0]?.main || "Clear",
        description: data.weather?.[0]?.description || "Weather update",
        humidity: data.main?.humidity,
        windSpeed: data.wind?.speed,
        windDirection: data.wind?.deg != null ? `${data.wind.deg}°` : null,
        visibility: data.visibility != null ? Math.round(data.visibility / 1000) : null,
        pressure: data.main?.pressure,
        uvIndex: null, // Not in standard current weather API
        airQualityIndex: null,
        dewPoint: null,
        cloudCoverage: data.clouds?.all,
        sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString() : null,
        sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString() : null,
        icon: (data.weather?.[0]?.description || "clear").toLowerCase(),
        updatedAt: new Date().toISOString(),
      },
      highlights: [
        { label: "Humidity", value: data.main?.humidity != null ? `${data.main.humidity}%` : "--" },
        {
          label: "Wind",
          value:
            data.wind?.speed != null
              ? `${data.wind.speed} ${units === "metric" ? "m/s" : "mph"}`
              : "--",
        },
        { label: "Visibility", value: data.visibility != null ? `${Math.round(data.visibility / 1000)} km` : "--" },
        { label: "Pressure", value: data.main?.pressure != null ? `${data.main.pressure} hPa` : "--" },
      ],
    };
  } catch (error) {
    if (error.statusCode === 404) throw error;
    return buildMockCurrent(city, units);
  }
}

export async function fetchForecast(city, units) {
  try {
    const data = await fetchFromOpenWeather(LIVE_BASE_URL, "/forecast", {
      q: city,
      units: units,
    });

    const entryList = data?.list;
    if (!Array.isArray(entryList) || entryList.length === 0) {
      return buildMockForecast(city, units);
    }

    // Process 3-hour forecast into daily summaries
    const dailyMap = new Map();
    entryList.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          temps: [],
          conditions: [],
          item: item
        });
      }
      const dayData = dailyMap.get(date);
      dayData.temps.push(item.main.temp);
      dayData.conditions.push(item.weather[0].main);
    });

    const daily = Array.from(dailyMap.entries()).slice(0, 7).map(([date, data]) => {
      return {
        day: new Date(date).toLocaleDateString([], { weekday: "short" }),
        high: Math.max(...data.temps),
        low: Math.min(...data.temps),
        condition: data.conditions[Math.floor(data.conditions.length / 2)], // representative condition
        sunrise: "--", // Not in 5-day forecast
        sunset: "--",
      };
    });

    // Hourly forecast (next 6 intervals)
    const hourly = entryList.slice(0, 6).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      temp: item.main.temp,
      rainChance: Math.round((item.pop || 0) * 100),
    }));

    return {
      source: "live",
      city,
      units,
      hourly,
      daily,
    };
  } catch (error) {
    return buildMockForecast(city, units);
  }
}

export async function fetchSuggestions(query) {
  if (!query) return mockCities.slice(0, 5);

  const suggestions = await fetchOpenWeatherCitySuggestions(query);
  if (suggestions && suggestions.length) return suggestions;

  return mockCities
    .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
}

export async function fetchHistory(city, units) {
  const cityMatch = await fetchCoordinatesForHistory(city);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6);

  const temperatureUnit = units === "imperial" ? "fahrenheit" : "celsius";
  const windSpeedUnit = units === "imperial" ? "mph" : "kmh";

  const url = new URL(ARCHIVE_BASE_URL);
  Object.entries({
    latitude: cityMatch.lat,
    longitude: cityMatch.lon,
    start_date: startDate.toISOString().slice(0, 10),
    end_date: endDate.toISOString().slice(0, 10),
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    timezone: "auto",
  }).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw createHttpError("Failed to fetch previous week weather.", response.status);
  }

  const archiveData = await response.json();
  if (!archiveData?.daily?.time?.length) {
    throw createHttpError("No previous week weather data available for this city.", 404);
  }

  return formatHistoryResponse(cityMatch, archiveData.daily, units);
}
