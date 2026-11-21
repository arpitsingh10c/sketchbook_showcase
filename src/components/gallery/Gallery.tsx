import { useEffect, useState } from 'react';
import type { CatalogBook } from '../../content/types';
import type { GalleryCameraConfig } from '../scene/galleryCamera';
import { SketchbookScene } from '../scene/SketchbookScene';
import { getGalleryLayout } from './galleryLayout';
import { SketchbookLabel } from './SketchbookLabel';

interface GalleryProps {
  books: CatalogBook[];
  onSelect: (slug: string) => void;
  cameraConfig?: GalleryCameraConfig;
}

export function Gallery({ books, onSelect, cameraConfig }: GalleryProps) {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 700);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
    <section className="canvas-stage" style={{ height: sceneHeight }} aria-label="Sketchbook collection">
      <SketchbookScene
        books={books}
        columns={columns}
        hoveredId={hoveredId}
        narrow={narrow}
        reducedMotion={reducedMotion}
        cameraConfig={cameraConfig}
      />
      <div className="gallery-caption-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {books.map((book) => (
          <SketchbookLabel
            key={book.id}
            book={book}
            onSelect={() => onSelect(book.slug)}
            onHoverChange={(hovered) => setHoveredId(hovered ? book.id : null)}
          />
        ))}
      </div>
    </section>
  );
}
