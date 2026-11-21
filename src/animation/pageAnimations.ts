export function clampPageTurnProgress(progress: number) {
  return Math.min(1, Math.max(0, progress));
}
