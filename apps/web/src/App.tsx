import { addBar } from "@drumforge/core";
import { useMemo, useState, type ChangeEvent } from "react";

import {
  buildGridRows,
  changeProjectTempo,
  createInitialEditorProject,
  getFirstSection,
  stepLabels,
  toggleGridCell
} from "./editorModel";

export function App() {
  const [project, setProject] = useState(createInitialEditorProject);
  const section = getFirstSection(project);
  const totalHits = useMemo(
    () =>
      section.bars.reduce((count, bar) => count + bar.events.length, 0),
    [section.bars]
  );

  const handleTempoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTempo = event.currentTarget.valueAsNumber;

    if (Number.isNaN(nextTempo)) {
      return;
    }

    setProject((currentProject) =>
      changeProjectTempo(currentProject, nextTempo)
    );
  };

  const handleAddBar = () => {
    setProject((currentProject) => addBar(currentProject, section.id));
  };

  return (
    <main className="app-shell">
      <div className="workspace">
        <header className="top-bar">
          <div className="title-block">
            <p className="eyebrow">DrumForge</p>
            <h1>{project.title}</h1>
          </div>
          <div className="toolbar">
            <label className="tempo-control">
              <span>Tempo</span>
              <input
                aria-label="Tempo"
                type="number"
                min={40}
                max={260}
                step={1}
                value={project.tempo}
                onChange={handleTempoChange}
              />
            </label>
            <button type="button" onClick={handleAddBar}>
              Add bar
            </button>
          </div>
        </header>

        <section className="editor-layout" aria-label="Drum grid editor">
          <aside className="kit-panel" aria-label="Kit instruments">
            <div>
              <p className="panel-label">Kit</p>
              <h2>{project.kit.length} instruments</h2>
            </div>
            <ul className="kit-list">
              {project.kit.map((instrument) => (
                <li key={instrument.id}>
                  <span>{instrument.name}</span>
                  <small>MIDI {instrument.midiNote}</small>
                </li>
              ))}
            </ul>
            <dl className="project-stats">
              <div>
                <dt>Bars</dt>
                <dd>{section.bars.length}</dd>
              </div>
              <div>
                <dt>Hits</dt>
                <dd>{totalHits}</dd>
              </div>
            </dl>
          </aside>

          <div className="bars-panel">
            {section.bars.map((bar) => {
              const rows = buildGridRows(project, bar.id);

              return (
                <section className="bar-panel" key={bar.id}>
                  <div className="bar-header">
                    <div>
                      <p className="panel-label">{section.name}</p>
                      <h2>Bar {bar.index + 1}</h2>
                    </div>
                    <span>{bar.events.length} hits</span>
                  </div>

                  <div className="bar-grid" role="grid">
                    <div className="grid-corner" />
                    {stepLabels.map((label, step) => (
                      <div
                        className={step % 4 === 0 ? "step-label beat" : "step-label"}
                        key={`${bar.id}-step-${step}`}
                        role="columnheader"
                      >
                        {label}
                      </div>
                    ))}

                    {rows.map((row) => (
                      <div className="grid-row" key={`${bar.id}-${row.instrument.id}`}>
                        <div className="instrument-cell" role="rowheader">
                          {row.instrument.name}
                        </div>
                        {row.cells.map((cell) => (
                          <button
                            aria-label={`${row.instrument.name} step ${cell.step + 1}`}
                            aria-pressed={cell.active}
                            className={cell.active ? "grid-cell active" : "grid-cell"}
                            key={`${row.instrument.id}-${cell.step}`}
                            onClick={() => {
                              setProject((currentProject) =>
                                toggleGridCell(
                                  currentProject,
                                  bar.id,
                                  row.instrument.id,
                                  cell.step
                                )
                              );
                            }}
                            title={`${row.instrument.name} ${cell.label}`}
                            type="button"
                          >
                            <span />
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
