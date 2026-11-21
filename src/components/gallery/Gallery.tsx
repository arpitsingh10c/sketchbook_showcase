import { useEffect, useState } from 'react';
import type { CatalogBook } from '../../content/types';
import { SketchbookScene } from '../scene/SketchbookScene';
import { SketchbookLabel } from './SketchbookLabel';

interface GalleryProps {
  books: CatalogBook[];
  onSelect: (slug: string) => void;
}

export function Gallery({ books, onSelect }: GalleryProps) {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 700);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 700);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const columns = narrow ? 1 : 2;
  const rows = Math.ceil(books.length / columns);
  const sceneHeight = Math.max(620, rows * (narrow ? 440 : 430));

  return (
    <section className="canvas-stage" style={{ height: sceneHeight }} aria-label="Sketchbook collection">
      <SketchbookScene books={books} columns={columns} hoveredId={hoveredId} narrow={narrow} />
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
