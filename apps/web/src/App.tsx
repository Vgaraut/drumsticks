import { createDefaultProjectSummary } from "@drumforge/core";

export function App() {
  const project = createDefaultProjectSummary();

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="top-bar">
          <div>
            <p className="eyebrow">DrumForge</p>
            <h1>{project.title}</h1>
          </div>
          <div className="transport">
            <button type="button">Play</button>
            <button type="button">Export</button>
          </div>
        </div>
        <div className="editor-preview" aria-label="Grid editor placeholder">
          <div className="kit-list">
            {project.instruments.map((instrument) => (
              <span key={instrument}>{instrument}</span>
            ))}
          </div>
          <div className="grid">
            {Array.from({ length: 16 }, (_, step) => (
              <span key={step} className={step % 4 === 0 ? "beat" : undefined}>
                {step + 1}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
