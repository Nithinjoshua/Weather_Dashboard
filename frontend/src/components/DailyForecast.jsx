export default function DailyForecast({ daily }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">7-Day Forecast</p>
          <h2>Week outlook</h2>
        </div>
      </div>

      <div className="daily-list">
        {daily.map((day) => (
          <article className="daily-row" key={day.day}>
            <div>
              <strong>{day.day}</strong>
              <span>{day.condition}</span>
            </div>
            <div>
              <span>{Math.round(day.low)} deg</span>
              <strong>{Math.round(day.high)} deg</strong>
            </div>
            <div>
              <span>{day.sunrise}</span>
              <span>{day.sunset}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
