export type PageTurnDirection = 'forward' | 'backward';

export interface PageTurnConfig {
  duration: number;
  ease: string;
}

export const defaultPageTurnConfig: PageTurnConfig = {
  duration: 0.82,
  ease: 'power2.inOut',
};

export interface PageTurnPlan {
  endProgress: number;
  startProgress: number;
  targetPageIndex: number;
  turningPageIndex: number;
  underlyingPageIndex: number;
}

export function clampPageTurnProgress(progress: number) {
  return Math.min(1, Math.max(0, progress));
}

export function getPageTurnPlan(
  pageCount: number,
  currentPageIndex: number,
  direction: PageTurnDirection,
): PageTurnPlan | null {
  if (pageCount <= 0 || currentPageIndex < 0 || currentPageIndex >= pageCount) return null;

  if (direction === 'forward') {
    if (currentPageIndex >= pageCount - 1) return null;
    return {
      endProgress: 1,
      startProgress: 0,
      targetPageIndex: currentPageIndex + 1,
      turningPageIndex: currentPageIndex,
      underlyingPageIndex: currentPageIndex + 1,
    };
  }

  if (currentPageIndex === 0) return null;
  return {
    endProgress: 0,
    startProgress: 1,
    targetPageIndex: currentPageIndex - 1,
    turningPageIndex: currentPageIndex - 1,
    underlyingPageIndex: currentPageIndex,
  };
}
