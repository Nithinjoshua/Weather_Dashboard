export default function HighlightsGrid({ items }) {
  return (
    <section className="highlights-grid">
      {items.map((item) => (
        <article className="panel metric-card" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}
