import { useEffect, useRef, useState } from 'react';
import type { BookTransitionConfig } from '../../animation/bookTransitions';
import type { PageTurnConfig, PageTurnDirection } from '../../animation/pageAnimations';
import type { AppMode, CatalogBook } from '../../content/types';
import type { SketchbookPage } from '../book/pageTypes';
import type { GalleryCameraConfig } from '../scene/galleryCamera';
import { SketchbookScene } from '../scene/SketchbookScene';
import { getGalleryLayout } from './galleryLayout';
import { SketchbookLabel } from './SketchbookLabel';

interface GalleryProps {
  activeSlug: string | null;
  books: CatalogBook[];
  inputLocked: boolean;
  mode: AppMode;
  onSelect: (slug: string) => void;
  onCloseComplete: () => void;
  onOpenComplete: () => void;
  currentPageIndex: number;
  onPageTurnComplete: () => void;
  pages: SketchbookPage[];
  pageTurnConfig?: PageTurnConfig;
  pageTurnDirection: PageTurnDirection | null;
  cameraConfig?: GalleryCameraConfig;
  transitionConfig?: BookTransitionConfig;
}

export function Gallery({
  activeSlug,
  books,
  inputLocked,
  mode,
  onSelect,
  onCloseComplete,
  onOpenComplete,
  currentPageIndex,
  onPageTurnComplete,
  pages,
  pageTurnConfig,
  pageTurnDirection,
  cameraConfig,
  transitionConfig,
}: GalleryProps) {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 700);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onResize = () => setNarrow(window.innerWidth < 700);
    const onMotionChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    window.addEventListener('resize', onResize);
    motionPreference.addEventListener('change', onMotionChange);
    return () => {
      window.removeEventListener('resize', onResize);
      motionPreference.removeEventListener('change', onMotionChange);
    };
  }, []);

  const { columns, sceneHeight } = getGalleryLayout(books.length, narrow);

  return (
    <section className="canvas-stage-shell" style={{ height: sceneHeight }} aria-label="Sketchbook collection">
      <div ref={stageRef} className="canvas-stage" style={{ height: sceneHeight }}>
        <SketchbookScene
          activeSlug={activeSlug}
          books={books}
          columns={columns}
          currentPageIndex={currentPageIndex}
          hoveredId={hoveredId}
          mode={mode}
          narrow={narrow}
          onCloseComplete={onCloseComplete}
          onOpenComplete={onOpenComplete}
          onPageTurnComplete={onPageTurnComplete}
          pages={pages}
          pageTurnConfig={pageTurnConfig}
          pageTurnDirection={pageTurnDirection}
          reducedMotion={reducedMotion}
          stageRef={stageRef}
          cameraConfig={cameraConfig}
          transitionConfig={transitionConfig}
        />
        <div className="gallery-caption-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {books.map((book) => (
            <SketchbookLabel
              key={book.id}
              book={book}
              disabled={inputLocked}
              onSelect={() => onSelect(book.slug)}
              onHoverChange={(hovered) => setHoveredId(hovered ? book.id : null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
