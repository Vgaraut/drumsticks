export type PlaybackStatus = "idle" | "playing" | "stopped";

export function getInitialPlaybackStatus(): PlaybackStatus {
  return "idle";
}
