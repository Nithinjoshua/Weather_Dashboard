export default function SearchBar({
  value,
  onChange,
  onSubmit,
  suggestions,
  onSelectSuggestion,
  onRefresh,
  refreshing,
}) {
  return (
    <div className="panel search-panel">
      <div className="search-header">
        <p className="eyebrow">Live Search</p>
        <div className="search-heading-row">
          <h2>Track weather anywhere</h2>
          <button className="refresh-button" type="button" onClick={onRefresh} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh Now"}
          </button>
        </div>
      </div>

      <form className="search-form" onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search city"
          aria-label="Search city"
        />
        <button type="submit">Search</button>
      </form>

      <div className="suggestion-list">
        {suggestions.map((city) => (
          <button key={city} type="button" onClick={() => onSelectSuggestion(city)}>
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
