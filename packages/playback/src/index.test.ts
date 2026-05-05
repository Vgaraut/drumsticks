import { addBar, addHit, createDefaultProject } from "@drumforge/core";
import { describe, expect, it } from "vitest";

import {
  createPlaybackSchedule,
  getStepDurationSeconds,
  getStepTimeSeconds
} from "./index";

describe("playback scheduling", () => {
  it("schedules step 0 at the start", () => {
    expect(getStepTimeSeconds(0, 120)).toBe(0);
  });

  it("schedules step 4 one beat later at a given BPM", () => {
    expect(getStepTimeSeconds(4, 120)).toBe(0.5);
  });

  it("tempo changes affect schedule timing", () => {
    expect(getStepDurationSeconds(120)).toBe(0.125);
    expect(getStepDurationSeconds(60)).toBe(0.25);
  });

  it("schedules project hits by bar and step", () => {
    const project = createDefaultProject();
    const barId = project.sections[0]?.bars[0]?.id;
    const kickId = project.kit.find((instrument) => instrument.name === "Kick")?.id;
    const snareId = project.kit.find((instrument) => instrument.name === "Snare")?.id;

    if (!barId || !kickId || !snareId) {
      throw new Error("Expected default project to include kick, snare, and a bar");
    }

    const withHits = addHit(
      addHit(project, barId, kickId, 0, 90),
      barId,
      snareId,
      4,
      120
    );
    const schedule = createPlaybackSchedule(withHits, {
      kick: "/samples/kick.wav",
      snare: "/samples/snare.wav"
    });

    expect(schedule.hitEvents).toHaveLength(2);
    expect(schedule.hitEvents[0]).toMatchObject({
      instrumentId: kickId,
      sampleKey: "kick",
      step: 0,
      timeSeconds: 0
    });
    expect(schedule.hitEvents[1]).toMatchObject({
      instrumentId: snareId,
      sampleKey: "snare",
      step: 4,
      timeSeconds: 0.5
    });
  });

  it("empty bars do not crash", () => {
    const project = createDefaultProject();
    const sectionId = project.sections[0]?.id;

    if (!sectionId) {
      throw new Error("Expected default project to include a section");
    }

    const withSecondEmptyBar = addBar(project, sectionId);
    const schedule = createPlaybackSchedule(withSecondEmptyBar);

    expect(schedule.hitEvents).toEqual([]);
    expect(schedule.stepEvents).toHaveLength(32);
    expect(schedule.durationSeconds).toBe(4);
  });

  it("reports missing sample keys without dropping hit events", () => {
    const project = createDefaultProject();
    const barId = project.sections[0]?.bars[0]?.id;
    const kickId = project.kit.find((instrument) => instrument.name === "Kick")?.id;

    if (!barId || !kickId) {
      throw new Error("Expected default project to include kick and a bar");
    }

    const withHit = addHit(project, barId, kickId, 0, 90);
    const schedule = createPlaybackSchedule(withHit);

    expect(schedule.hitEvents).toHaveLength(1);
    expect(schedule.missingSampleKeys).toEqual(["kick"]);
  });
});
