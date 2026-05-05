import {
  addBar,
  type DrumInstrumentPatch,
  type DrumInstrumentType
} from "@drumforge/core";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import {
  addKitInstrument,
  buildGridRows,
  changeProjectTempo,
  countInstrumentHits,
  createInstrumentDraft,
  createInitialEditorProject,
  getFirstSection,
  instrumentTypeLabels,
  instrumentTypeOptions,
  removeKitInstrument,
  resetProjectKit,
  stepLabels,
  toggleGridCell,
  updateKitInstrument,
  type InstrumentDraft
} from "./editorModel";

export function App() {
  const [project, setProject] = useState(createInitialEditorProject);
  const [instrumentDraft, setInstrumentDraft] =
    useState<InstrumentDraft>(createInstrumentDraft);
  const [kitError, setKitError] = useState<string | null>(null);
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

  const handleAddInstrument = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setProject(addKitInstrument(project, instrumentDraft));
      setInstrumentDraft(createInstrumentDraft());
      setKitError(null);
    } catch (error) {
      setKitError(getErrorMessage(error));
    }
  };

  const handleInstrumentUpdate = (
    instrumentId: string,
    patch: DrumInstrumentPatch
  ) => {
    try {
      setProject(updateKitInstrument(project, instrumentId, patch));
      setKitError(null);
    } catch (error) {
      setKitError(getErrorMessage(error));
    }
  };

  const handleInstrumentRemove = (instrumentId: string) => {
    try {
      setProject(removeKitInstrument(project, instrumentId));
      setKitError(null);
    } catch (error) {
      setKitError(getErrorMessage(error));
    }
  };

  const handleKitReset = () => {
    try {
      setProject(resetProjectKit(project));
      setKitError(null);
    } catch (error) {
      setKitError(getErrorMessage(error));
    }
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
            <div className="kit-panel-header">
              <div>
                <p className="panel-label">Kit</p>
                <h2>{project.kit.length} instruments</h2>
              </div>
              <button type="button" onClick={handleKitReset}>
                Reset
              </button>
            </div>
            <p className="kit-warning">
              Removing an instrument also removes its grid hits.
            </p>
            {kitError ? (
              <p className="error-message" role="alert">
                {kitError}
              </p>
            ) : null}
            <ul className="kit-editor-list">
              {project.kit.map((instrument) => (
                <li className="kit-editor-row" key={instrument.id}>
                  <div className="instrument-row-top">
                    <strong>{instrument.name}</strong>
                    <span>{countInstrumentHits(project, instrument.id)} hits</span>
                  </div>
                  <label className="field compact-field">
                    <span>Name</span>
                    <input
                      aria-label={`${instrument.name} name`}
                      value={instrument.name}
                      onChange={(event) =>
                        handleInstrumentUpdate(instrument.id, {
                          name: event.currentTarget.value
                        })
                      }
                    />
                  </label>
                  <label className="field compact-field">
                    <span>Type</span>
                    <select
                      aria-label={`${instrument.name} type`}
                      value={instrument.type}
                      onChange={(event) =>
                        handleInstrumentUpdate(instrument.id, {
                          type: event.currentTarget.value as DrumInstrumentType
                        })
                      }
                    >
                      {instrumentTypeOptions.map((instrumentType) => (
                        <option key={instrumentType} value={instrumentType}>
                          {instrumentTypeLabels[instrumentType]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="field-pair">
                    <label className="field compact-field">
                      <span>MIDI</span>
                      <input
                        aria-label={`${instrument.name} MIDI note`}
                        max={127}
                        min={0}
                        type="number"
                        value={instrument.midiNote}
                        onChange={(event) => {
                          const midiNote = event.currentTarget.valueAsNumber;

                          if (!Number.isNaN(midiNote)) {
                            handleInstrumentUpdate(instrument.id, { midiNote });
                          }
                        }}
                      />
                    </label>
                    <label className="field compact-field">
                      <span>Sample</span>
                      <input
                        aria-label={`${instrument.name} sample key`}
                        value={instrument.sampleKey}
                        onChange={(event) =>
                          handleInstrumentUpdate(instrument.id, {
                            sampleKey: event.currentTarget.value
                          })
                        }
                      />
                    </label>
                  </div>
                  <button
                    className="remove-button"
                    disabled={project.kit.length === 1}
                    type="button"
                    onClick={() => handleInstrumentRemove(instrument.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <form className="add-instrument-form" onSubmit={handleAddInstrument}>
              <div className="instrument-row-top">
                <strong>Add instrument</strong>
              </div>
              <label className="field compact-field">
                <span>Name</span>
                <input
                  aria-label="New instrument name"
                  value={instrumentDraft.name}
                  onChange={(event) =>
                    setInstrumentDraft((draft) => ({
                      ...draft,
                      name: event.currentTarget.value
                    }))
                  }
                />
              </label>
              <label className="field compact-field">
                <span>Type</span>
                <select
                  aria-label="New instrument type"
                  value={instrumentDraft.type}
                  onChange={(event) =>
                    setInstrumentDraft((draft) => ({
                      ...draft,
                      type: event.currentTarget.value as DrumInstrumentType
                    }))
                  }
                >
                  {instrumentTypeOptions.map((instrumentType) => (
                    <option key={instrumentType} value={instrumentType}>
                      {instrumentTypeLabels[instrumentType]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="field-pair">
                <label className="field compact-field">
                  <span>MIDI</span>
                  <input
                    aria-label="New instrument MIDI note"
                    max={127}
                    min={0}
                    type="number"
                    value={instrumentDraft.midiNote}
                    onChange={(event) => {
                      const midiNote = event.currentTarget.valueAsNumber;

                      if (!Number.isNaN(midiNote)) {
                        setInstrumentDraft((draft) => ({
                          ...draft,
                          midiNote
                        }));
                      }
                    }}
                  />
                </label>
                <label className="field compact-field">
                  <span>Sample</span>
                  <input
                    aria-label="New instrument sample key"
                    value={instrumentDraft.sampleKey}
                    onChange={(event) =>
                      setInstrumentDraft((draft) => ({
                        ...draft,
                        sampleKey: event.currentTarget.value
                      }))
                    }
                  />
                </label>
              </div>
              <button type="submit">Add instrument</button>
            </form>
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

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to update kit";
}
