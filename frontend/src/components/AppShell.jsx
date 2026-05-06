const pages = [
  { id: "dashboard", label: "Dashboard" },
  { id: "hourly", label: "Hourly Forecast" },
  { id: "history", label: "Previous Week" },
  { id: "settings", label: "Settings" },
];

export default function AppShell({ activePage, onNavigate, units, onUnitChange, children }) {
  return (
    <div className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <div className="app-layout">
        <aside className="side-nav">
          <div className="nav-brand">
            <span className="brand-mark">W</span>
            <div>
              <p className="eyebrow">Weather Dashboard</p>
              <h1>Weather Center</h1>
            </div>
          </div>

          <nav className="page-nav sidebar-page-nav">
            {pages.map((page) => (
              <button
                key={page.id}
                className={activePage === page.id ? "page-link active" : "page-link"}
                type="button"
                onClick={() => onNavigate(page.id)}
              >
                <span className="page-link-dot" />
                {page.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="content-shell">
          <header className="content-header">
            <div>
              <p className="eyebrow">Page Navigation</p>
              <h2 className="content-title">
                {pages.find((page) => page.id === activePage)?.label || "Dashboard"}
              </h2>
            </div>

            <div className="unit-toggle">
              <button
                className={units === "metric" ? "active" : ""}
                type="button"
                onClick={() => onUnitChange("metric")}
              >
                C
              </button>
              <button
                className={units === "imperial" ? "active" : ""}
                type="button"
                onClick={() => onUnitChange("imperial")}
              >
                F
              </button>
            </div>
          </header>

          <main className="dashboard">{children}</main>
        </div>
      </div>
    </div>
  );
}
