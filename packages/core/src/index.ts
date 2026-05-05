export type ProjectSummary = {
  title: string;
  instruments: string[];
};

export function createDefaultProjectSummary(): ProjectSummary {
  return {
    title: "Untitled Groove",
    instruments: ["Kick", "Snare", "Closed Hi-Hat", "Open Hi-Hat", "Crash", "Ride"]
  };
}
