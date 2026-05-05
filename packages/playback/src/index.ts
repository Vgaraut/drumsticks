import type { DrumProject } from "@drumforge/core";

export type PlaybackStatus = "idle" | "playing" | "stopped";

export type SampleMap = Record<string, string>;

export type PlaybackPosition = {
  sectionId: string;
  barId: string;
  step: number;
};

export type PlaybackOptions = {
  loop?: boolean;
  onStep?: (position: PlaybackPosition) => void;
  onEnded?: () => void;
};

export type ScheduledHitEvent = PlaybackPosition & {
  instrumentId: string;
  sampleKey: string;
  velocity: number;
  timeSeconds: number;
};

export type ScheduledStepEvent = PlaybackPosition & {
  timeSeconds: number;
};

export type PlaybackSchedule = {
  hitEvents: ScheduledHitEvent[];
  stepEvents: ScheduledStepEvent[];
  durationSeconds: number;
  missingSampleKeys: string[];
};

export type PlaybackEngine = {
  loadSamples(sampleMap: SampleMap): Promise<void>;
  playProject(project: DrumProject, options?: PlaybackOptions): Promise<void>;
  stop(): void;
  dispose(): void;
  getStatus(): PlaybackStatus;
};

const stepsPerBar = 16;
const beatsPerBar = 4;
const fallbackHitDurationSeconds = 0.08;

export function getInitialPlaybackStatus(): PlaybackStatus {
  return "idle";
}

export function getStepDurationSeconds(tempo: number): number {
  return 60 / tempo / (stepsPerBar / beatsPerBar);
}

export function getStepTimeSeconds(
  absoluteStep: number,
  tempo: number
): number {
  return absoluteStep * getStepDurationSeconds(tempo);
}

export function createPlaybackSchedule(
  project: DrumProject,
  sampleMap: SampleMap = {}
): PlaybackSchedule {
  const stepDurationSeconds = getStepDurationSeconds(project.tempo);
  const hitEvents: ScheduledHitEvent[] = [];
  const stepEvents: ScheduledStepEvent[] = [];
  const missingSampleKeys = new Set<string>();
  let absoluteBarIndex = 0;

  project.sections.forEach((section) => {
    section.bars.forEach((bar) => {
      for (let step = 0; step < project.resolution; step += 1) {
        stepEvents.push({
          sectionId: section.id,
          barId: bar.id,
          step,
          timeSeconds: getStepTimeSeconds(
            absoluteBarIndex * project.resolution + step,
            project.tempo
          )
        });
      }

      bar.events.forEach((hit) => {
        const instrument = project.kit.find(
          (candidate) => candidate.id === hit.instrumentId
        );

        if (!instrument) {
          return;
        }

        if (!sampleMap[instrument.sampleKey]) {
          missingSampleKeys.add(instrument.sampleKey);
        }

        hitEvents.push({
          sectionId: section.id,
          barId: bar.id,
          step: hit.step,
          instrumentId: instrument.id,
          sampleKey: instrument.sampleKey,
          velocity: hit.velocity,
          timeSeconds: getStepTimeSeconds(
            absoluteBarIndex * project.resolution + hit.step,
            project.tempo
          )
        });
      });

      absoluteBarIndex += 1;
    });
  });

  return {
    hitEvents: hitEvents.sort((left, right) => left.timeSeconds - right.timeSeconds),
    stepEvents,
    durationSeconds: absoluteBarIndex * project.resolution * stepDurationSeconds,
    missingSampleKeys: [...missingSampleKeys].sort()
  };
}

export function createBrowserPlaybackEngine(): PlaybackEngine {
  return new BrowserPlaybackEngine();
}

class BrowserPlaybackEngine implements PlaybackEngine {
  private audioContext?: AudioContext;
  private sampleMap: SampleMap = {};
  private sampleBuffers = new Map<string, AudioBuffer>();
  private timeoutIds: number[] = [];
  private activeNodes: AudioScheduledSourceNode[] = [];
  private status: PlaybackStatus = "idle";
  private loop = false;
  private currentProject?: DrumProject;
  private currentOptions?: PlaybackOptions;

  async loadSamples(sampleMap: SampleMap): Promise<void> {
    this.sampleMap = { ...sampleMap };
    const context = this.getAudioContext();

    await Promise.all(
      Object.entries(sampleMap).map(async ([sampleKey, url]) => {
        if (this.sampleBuffers.has(sampleKey)) {
          return;
        }

        try {
          const response = await fetch(url);

          if (!response.ok) {
            return;
          }

          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await context.decodeAudioData(arrayBuffer);
          this.sampleBuffers.set(sampleKey, audioBuffer);
        } catch {
          this.sampleBuffers.delete(sampleKey);
        }
      })
    );
  }

  async playProject(
    project: DrumProject,
    options: PlaybackOptions = {}
  ): Promise<void> {
    const context = this.getAudioContext();

    this.stop();
    this.currentProject = project;
    this.currentOptions = options;
    this.loop = Boolean(options.loop);

    if (context.state === "suspended") {
      await context.resume();
    }

    this.status = "playing";
    this.scheduleProject(project, options, context.currentTime + 0.03);
  }

  stop(): void {
    this.timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    this.timeoutIds = [];

    this.activeNodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        // Already stopped by the browser scheduler.
      }
    });
    this.activeNodes = [];
    this.status = "stopped";
  }

  dispose(): void {
    this.stop();
    this.sampleBuffers.clear();
    void this.audioContext?.close();
    this.audioContext = undefined;
    this.status = "idle";
  }

  getStatus(): PlaybackStatus {
    return this.status;
  }

  private scheduleProject(
    project: DrumProject,
    options: PlaybackOptions,
    startTime: number
  ): void {
    const context = this.getAudioContext();
    const schedule = createPlaybackSchedule(project, this.sampleMap);

    schedule.hitEvents.forEach((event) => {
      this.scheduleHit(context, event, startTime + event.timeSeconds);
    });

    schedule.stepEvents.forEach((event) => {
      this.timeoutIds.push(
        window.setTimeout(
          () => options.onStep?.(event),
          Math.max(0, (startTime + event.timeSeconds - context.currentTime) * 1000)
        )
      );
    });

    this.timeoutIds.push(
      window.setTimeout(
        () => this.handleScheduleEnd(options),
        Math.max(0, (startTime + schedule.durationSeconds - context.currentTime) * 1000)
      )
    );
  }

  private scheduleHit(
    context: AudioContext,
    event: ScheduledHitEvent,
    startTime: number
  ): void {
    const sampleBuffer = this.sampleBuffers.get(event.sampleKey);

    if (sampleBuffer) {
      const source = context.createBufferSource();
      const gain = context.createGain();

      source.buffer = sampleBuffer;
      gain.gain.setValueAtTime(event.velocity / 127, startTime);
      source.connect(gain).connect(context.destination);
      source.start(startTime);
      this.activeNodes.push(source);
      return;
    }

    this.scheduleFallbackHit(context, event, startTime);
  }

  private scheduleFallbackHit(
    context: AudioContext,
    event: ScheduledHitEvent,
    startTime: number
  ): void {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const baseFrequency = getFallbackFrequency(event.sampleKey);

    oscillator.type = event.sampleKey.includes("hat") ? "square" : "sine";
    oscillator.frequency.setValueAtTime(baseFrequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(50, baseFrequency * 0.45),
      startTime + fallbackHitDurationSeconds
    );
    gain.gain.setValueAtTime(event.velocity / 127, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + fallbackHitDurationSeconds);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + fallbackHitDurationSeconds);
    this.activeNodes.push(oscillator);
  }

  private handleScheduleEnd(options: PlaybackOptions): void {
    if (this.loop && this.currentProject) {
      this.scheduleProject(
        this.currentProject,
        this.currentOptions ?? options,
        this.getAudioContext().currentTime + 0.01
      );
      return;
    }

    this.timeoutIds = [];
    this.activeNodes = [];
    this.status = "stopped";
    options.onEnded?.();
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    return this.audioContext;
  }
}

function getFallbackFrequency(sampleKey: string): number {
  if (sampleKey.includes("kick")) {
    return 95;
  }

  if (sampleKey.includes("snare") || sampleKey.includes("clap")) {
    return 210;
  }

  if (sampleKey.includes("hat") || sampleKey.includes("crash")) {
    return 620;
  }

  if (sampleKey.includes("tom")) {
    return 160;
  }

  return 260;
}
