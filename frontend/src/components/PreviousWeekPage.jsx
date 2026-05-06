function formatWeatherLabel(code) {
  if ([0, 1].includes(code)) {
    return "Clear";
  }
  if ([2, 3].includes(code)) {
    return "Cloudy";
  }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return "Rain";
  }
  if ([71, 73, 75].includes(code)) {
    return "Snow";
  }
  if ([95, 96, 99].includes(code)) {
    return "Storm";
  }

  return "Mixed";
}

export default function PreviousWeekPage({ history, units }) {
  return (
    <>
      <section className="topbar">
        <div>
          <p className="eyebrow">Previous Week</p>
          <h2>
            Past 7 days in {history.city}, {history.country}
          </h2>
        </div>
      </section>

      <section className="history-grid">
        {history.entries.map((entry) => (
          <article className="panel history-card" key={entry.date}>
            <div className="history-header">
              <div>
                <p className="eyebrow">{entry.day}</p>
                <h3>{entry.date}</h3>
              </div>
              <span className="history-badge">{formatWeatherLabel(entry.weatherCode)}</span>
            </div>

            <div className="history-values">
              <div>
                <span>High</span>
                <strong>{Math.round(entry.high)} deg</strong>
              </div>
              <div>
                <span>Low</span>
                <strong>{Math.round(entry.low)} deg</strong>
              </div>
              <div>
                <span>Rain</span>
                <strong>
                  {entry.rain} {units === "metric" ? "mm" : "in"}
                </strong>
              </div>
              <div>
                <span>Wind</span>
                <strong>
                  {Math.round(entry.windSpeed)} {units === "metric" ? "km/h" : "mph"}
                </strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
