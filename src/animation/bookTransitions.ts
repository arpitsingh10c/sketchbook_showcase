import type { AppMode } from '../content/types';

export const bookTransitionOrder: readonly AppMode[] = [
  'gallery',
  'opening',
  'reading',
  'showing-details',
  'closing',
];

export interface BookTransitionConfig {
  approachDepth: number;
  coverDuration: number;
  coverOpenAngle: number;
  coverStart: number;
  pageDuration: number;
  pageOpenAngle: number;
  pageStart: number;
  pageViewportHeight: number;
  pageViewportWidth: number;
  riseDuration: number;
  secondaryDepth: number;
  secondaryScale: number;
  settleDuration: number;
  settleOvershoot: number;
  settleStart: number;
  stageDuration: number;
  uiDuration: number;
}

export const defaultBookTransition: BookTransitionConfig = {
  approachDepth: 2.4,
  coverDuration: 0.95,
  coverOpenAngle: Math.PI - 0.08,
  coverStart: 0.38,
  pageDuration: 0.78,
  pageOpenAngle: Math.PI - 0.04,
  pageStart: 0.88,
  pageViewportHeight: 0.82,
  pageViewportWidth: 0.7,
  riseDuration: 1.32,
  secondaryDepth: -1.25,
  secondaryScale: 0.88,
  settleDuration: 0.42,
  settleOvershoot: 1.025,
  settleStart: 1.26,
  stageDuration: 1.15,
  uiDuration: 0.58,
};

export function calculateReadingScale(
  visibleWidth: number,
  visibleHeight: number,
  pageWidth: number,
  pageHeight: number,
  config: BookTransitionConfig,
) {
  return Math.min(
    (visibleWidth * config.pageViewportWidth) / pageWidth,
    (visibleHeight * config.pageViewportHeight) / pageHeight,
  );
}

export function calculateLeftPageOffset(visibleWidth: number, readingScale: number) {
  return visibleWidth / (2 * readingScale);
}
