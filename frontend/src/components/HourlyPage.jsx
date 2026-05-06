import HourlyForecast from "./HourlyForecast";
import TemperatureChart from "./TemperatureChart";

export default function HourlyPage({ cityName, forecast }) {
  return (
    <>
      <section className="topbar">
        <div>
          <p className="eyebrow">Hourly Forecast</p>
          <h2>Detailed hourly weather for {cityName}</h2>
        </div>
      </section>

      <section className="content-grid">
        <HourlyForecast hourly={forecast.hourly} />
        <TemperatureChart hourly={forecast.hourly} />
      </section>
    </>
  );
}
