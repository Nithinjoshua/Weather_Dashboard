export default function TemperatureChart({ hourly }) {
  const maxTemp = Math.max(...hourly.map((item) => item.temp));
  const minTemp = Math.min(...hourly.map((item) => item.temp));
  const spread = Math.max(maxTemp - minTemp, 1);

  const points = hourly
    .map((item, index) => {
      const x = (index / (hourly.length - 1 || 1)) * 100;
      const y = 100 - ((item.temp - minTemp) / spread) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Temperature Trend</p>
          <h2>Quick visual</h2>
        </div>
      </div>

      <div className="chart-shell">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Temperature trend">
          <polyline
            fill="none"
            stroke="url(#temp-gradient)"
            strokeWidth="3"
            points={points}
          />
          <defs>
            <linearGradient id="temp-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
