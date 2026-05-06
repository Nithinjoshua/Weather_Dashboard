const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    let message = "Unable to load weather data right now.";

    try {
      const data = await response.json();
      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Keep the fallback message when the response body is not JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export function fetchCurrentWeather(city, units) {
  return request(`/weather/current?city=${encodeURIComponent(city)}&units=${units}`);
}

export function fetchForecast(city, units) {
  return request(`/weather/forecast?city=${encodeURIComponent(city)}&units=${units}`);
}

export function fetchHistory(city, units) {
  return request(`/weather/history?city=${encodeURIComponent(city)}&units=${units}`);
}

export function fetchSuggestions(query) {
  return request(`/weather/search?q=${encodeURIComponent(query)}`);
}
