export default function SettingsPage({ theme, onThemeChange }) {
  return (
    <>
      <section className="topbar">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Customize your dashboard experience</h2>
        </div>
      </section>

      <section className="panel settings-card">
        <div className="settings-row">
          <div>
            <p className="eyebrow">Appearance</p>
            <h3>Theme Mode</h3>
            <p className="settings-copy">
              Choose whether the dashboard should use the light theme or dark theme.
            </p>
          </div>

          <div className="theme-options" role="group" aria-label="Theme mode">
            <button
              className={theme === "light" ? "theme-option active" : "theme-option"}
              type="button"
              onClick={() => onThemeChange("light")}
            >
              Light
            </button>
            <button
              className={theme === "dark" ? "theme-option active" : "theme-option"}
              type="button"
              onClick={() => onThemeChange("dark")}
            >
              Dark
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
