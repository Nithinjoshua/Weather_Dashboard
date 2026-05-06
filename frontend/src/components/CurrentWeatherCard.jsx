const iconMap = {
  clear: "SUN",
  sunny: "SUN",
  clouds: "CLD",
  cloudy: "CLD",
  rain: "RAN",
  storm: "STM",
  thunderstorm: "STM",
};

export default function CurrentWeatherCard({ weather }) {
  const icon = iconMap[weather.current.icon] || "CLD";
  const updatedAt = new Date(weather.current.updatedAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <section className="panel hero-card">
      <div className="hero-copy">
        <p className="eyebrow">Current Conditions</p>
        <h1>
          {weather.city}, {weather.country}
        </h1>
        <p className="hero-description">{weather.current.description}</p>
        <div className="temperature-row">
          <span className="weather-icon">{icon}</span>
          <span className="temperature-value">{Math.round(weather.current.temperature)} deg</span>
        </div>
        <p className="data-source">
          {weather.source === "live" ? "Live API data, auto-refresh every 10 seconds" : "Mock preview data"}
        </p>
        <p className="updated-at">Updated at {updatedAt}</p>
      </div>

      <div className="hero-meta">
        <div>
          <span>Feels like</span>
          <strong>{Math.round(weather.current.feelsLike)} deg</strong>
        </div>
        <div>
          <span>Humidity</span>
          <strong>{weather.current.humidity}%</strong>
        </div>
        <div>
          <span>Wind</span>
          <strong>
            {weather.current.windSpeed} {weather.units === "metric" ? "km/h" : "mph"}
          </strong>
        </div>
        <div>
          <span>Pressure</span>
          <strong>{weather.current.pressure} hPa</strong>
        </div>
      </div>
    </section>
  );
}
