export default function HourlyForecast({ hourly }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Hourly Forecast</p>
          <h2>Next few hours</h2>
        </div>
      </div>

      <div className="hourly-strip">
        {hourly.map((entry) => (
          <article className="hour-card" key={entry.time}>
            <span>{entry.time}</span>
            <strong>{Math.round(entry.temp)} deg</strong>
            <small>{entry.rainChance}% rain</small>
          </article>
        ))}
      </div>
    </section>
  );
}
