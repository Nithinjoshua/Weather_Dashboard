import { useEffect, useMemo, useState } from "react";

import {
  fetchCurrentWeather,
  fetchForecast,
  fetchHistory,
  fetchSuggestions,
} from "./api/weatherApi";
import AppShell from "./components/AppShell";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import DailyForecast from "./components/DailyForecast";
import HighlightsGrid from "./components/HighlightsGrid";
import HourlyPage from "./components/HourlyPage";
import PreviousWeekPage from "./components/PreviousWeekPage";
import SearchBar from "./components/SearchBar";
import SettingsPage from "./components/SettingsPage";
import TemperatureChart from "./components/TemperatureChart";

function getPageFromPath() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("hourly")) {
    return "hourly";
  }
  if (path.includes("history") || path.includes("week")) {
    return "history";
  }
  if (path.includes("settings")) {
    return "settings";
  }

  return "dashboard";
}

function getPathFromPage(page) {
  if (page === "hourly") {
    return "/hourly";
  }
  if (page === "history") {
    return "/history";
  }
  if (page === "settings") {
    return "/settings";
  }

  return "/";
}

export default function App() {
  const [city, setCity] = useState("Chennai");
  const [query, setQuery] = useState("Chennai");
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState(() => getPageFromPath());
  const [theme, setTheme] = useState(() => localStorage.getItem("weather-theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("weather-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onPopState = () => setActivePage(getPageFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentWeather(showRefreshState = false) {
      try {
        if (showRefreshState) {
          setRefreshing(true);
        }

        const currentData = await fetchCurrentWeather(city, units);
        if (isMounted) {
          setWeather(currentData);
          setError("");
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted && showRefreshState) {
          setRefreshing(false);
        }
      }
    }

    async function loadPageData() {
      try {
        setLoading(true);
        const [forecastData, historyData] = await Promise.all([
          fetchForecast(city, units),
          fetchHistory(city, units),
        ]);

        if (isMounted) {
          setForecast(forecastData);
          setHistory(historyData);
          setError("");
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCurrentWeather();
    loadPageData();
    const intervalId = setInterval(() => {
      loadCurrentWeather();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [city, units]);

  useEffect(() => {
    async function loadSuggestions() {
      const trimmed = query.trim();
      if (!trimmed) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await fetchSuggestions(trimmed);
        setSuggestions(data.suggestions);
      } catch {
        setSuggestions([]);
      }
    }

    const timeoutId = setTimeout(loadSuggestions, 220);
    return () => clearTimeout(timeoutId);
  }, [query]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }

    setCity(query.trim());
  }

  function handleSelectSuggestion(nextCity) {
    setQuery(nextCity);
    setCity(nextCity);
  }

  function handleNavigate(page) {
    const path = getPathFromPage(page);
    window.history.pushState({}, "", path);
    setActivePage(page);
  }

  async function handleRefreshNow() {
    try {
      setRefreshing(true);
      const [currentData, forecastData, historyData] = await Promise.all([
        fetchCurrentWeather(city, units),
        fetchForecast(city, units),
        fetchHistory(city, units),
      ]);

      setWeather(currentData);
      setForecast(forecastData);
      setHistory(historyData);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRefreshing(false);
    }
  }

  const pageContent = useMemo(() => {
    if (loading || !weather || !forecast || !history) {
      return <section className="panel loading-panel">Loading weather dashboard...</section>;
    }

    if (activePage === "hourly") {
      return <HourlyPage cityName={weather.city} forecast={forecast} />;
    }

    if (activePage === "history") {
      return <PreviousWeekPage history={history} units={units} />;
    }

    if (activePage === "settings") {
      return <SettingsPage theme={theme} onThemeChange={setTheme} />;
    }

    return (
      <>
        <section className="topbar">
          <div>
            <p className="eyebrow">Live Weather</p>
            <h2>Search a city and watch conditions refresh automatically</h2>
          </div>
        </section>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
          onRefresh={handleRefreshNow}
          refreshing={refreshing}
        />

        <CurrentWeatherCard weather={weather} />
        <HighlightsGrid items={weather.highlights} />

        <section className="content-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Hourly Preview</p>
                <h2>Next few hours</h2>
              </div>
            </div>
            <div className="hourly-strip">
              {forecast.hourly.map((entry) => (
                <article className="hour-card" key={entry.time}>
                  <span>{entry.time}</span>
                  <strong>{Math.round(entry.temp)} deg</strong>
                  <small>{entry.rainChance}% rain</small>
                </article>
              ))}
            </div>
          </div>
          <TemperatureChart hourly={forecast.hourly} />
        </section>

        <DailyForecast daily={forecast.daily} />
      </>
    );
  }, [activePage, forecast, history, loading, query, suggestions, theme, units, weather]);

  const showSearchBar = activePage !== "settings";

  return (
    <AppShell
      activePage={activePage}
      onNavigate={handleNavigate}
      units={units}
      onUnitChange={setUnits}
    >
      {activePage === "dashboard" ? (
        <>
          {error ? <div className="panel error-banner">{error}</div> : null}
          {pageContent}
        </>
      ) : (
        <>
          {showSearchBar ? (
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              suggestions={suggestions}
              onSelectSuggestion={handleSelectSuggestion}
              onRefresh={handleRefreshNow}
              refreshing={refreshing}
            />
          ) : null}
          {error ? <div className="panel error-banner">{error}</div> : null}
          {pageContent}
        </>
      )}
    </AppShell>
  );
}
