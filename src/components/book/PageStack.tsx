import gsap from 'gsap';
import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  defaultPageTurnConfig,
  getPageTurnPlan,
  type PageTurnConfig,
  type PageTurnDirection,
} from '../../animation/pageAnimations';
import { PAGE_HEIGHT, PAGE_WIDTH } from './bookDimensions';
import { DeformablePage, type DeformablePageHandle } from './DeformablePage';
import { PageMesh } from './PageMesh';
import type { SketchbookPage } from './pageTypes';
import { useNearbyPageTextures } from './useNearbyPageTextures';

interface PageStackProps {
  config?: PageTurnConfig;
  currentPageIndex: number;
  direction: PageTurnDirection | null;
  onTurnComplete: () => void;
  pages: SketchbookPage[];
  reducedMotion: boolean;
}

const PAGE_CENTER_X = 0.025;
const STATIC_PAGE_Z = 0.106;
const TURNING_PAGE_Z = 0.116;

export function PageStack({
  config = defaultPageTurnConfig,
  currentPageIndex,
  direction,
  onTurnComplete,
  pages,
  reducedMotion,
}: PageStackProps) {
  const turningPageRef = useRef<DeformablePageHandle>(null);
  const completionRef = useRef(onTurnComplete);
  completionRef.current = onTurnComplete;

  const getTextures = useNearbyPageTextures(pages, currentPageIndex);
  const plan = useMemo(
    () => direction ? getPageTurnPlan(pages.length, currentPageIndex, direction) : null,
    [currentPageIndex, direction, pages.length],
  );
  const staticPageIndex = plan?.underlyingPageIndex ?? currentPageIndex;
  const staticTextures = getTextures(staticPageIndex);
  const turningTextures = plan ? getTextures(plan.turningPageIndex) : null;

  useLayoutEffect(() => {
    if (!direction) return;
    if (!plan) {
      completionRef.current();
      return;
    }

    const progress = { value: plan.startProgress };
    turningPageRef.current?.setProgress(progress.value);
    const tween = gsap.to(progress, {
      value: plan.endProgress,
      duration: reducedMotion ? 0.01 : config.duration,
      ease: reducedMotion ? 'none' : config.ease,
      overwrite: true,
      onUpdate: () => turningPageRef.current?.setProgress(progress.value),
      onComplete: () => completionRef.current(),
    });

    return () => {
      tween.kill();
    };
  }, [config.duration, config.ease, direction, plan, reducedMotion]);

  return (
    <group>
      <PageMesh
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        map={staticTextures.front}
        position={[PAGE_CENTER_X, 0, STATIC_PAGE_Z]}
        segments={1}
      />

      {pages.length > 0 && (
        <DeformablePage
          ref={turningPageRef}
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          frontTexture={turningTextures?.front ?? null}
          backTexture={turningTextures?.back ?? null}
          initialProgress={plan?.startProgress ?? 0}
          position={[PAGE_CENTER_X - PAGE_WIDTH / 2, 0, TURNING_PAGE_Z]}
          visible={plan !== null}
        />
      )}
    </group>
  );
}
