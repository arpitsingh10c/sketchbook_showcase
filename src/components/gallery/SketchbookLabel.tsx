import type { CatalogBook } from '../../content/types';

interface SketchbookLabelProps {
  book: CatalogBook;
  onSelect: () => void;
  onHoverChange: (hovered: boolean) => void;
}

export function SketchbookLabel({ book, onSelect, onHoverChange }: SketchbookLabelProps) {
  return (
    <button
      className="gallery-caption"
      onClick={onSelect}
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      aria-label={`Open ${book.title}`}
    >
      <span className="book-hit-area" aria-hidden="true"><span>VIEW SKETCHBOOK</span></span>
      <span className="caption-count">COLLECTION · {book.sketchCount} SKETCHES</span>
      <strong>{book.title}</strong>
      <span>{book.description}</span>
    </button>
  );
}
