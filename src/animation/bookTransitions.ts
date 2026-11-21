import type { AppMode } from '../content/types';

export const bookTransitionOrder: readonly AppMode[] = [
  'gallery',
  'opening',
  'reading',
  'showing-details',
  'closing',
];

export const bookTransitionTiming = {
  rise: 0.9,
  coverOpen: 0.75,
  settle: 0.4,
} as const;
