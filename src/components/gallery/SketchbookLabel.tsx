import type { CatalogBook } from '../../content/types';

interface SketchbookLabelProps {
  book: CatalogBook;
  disabled: boolean;
  onSelect: () => void;
  onHoverChange: (hovered: boolean) => void;
}

export function SketchbookLabel({ book, disabled, onSelect, onHoverChange }: SketchbookLabelProps) {
  return (
    <button
      className="gallery-caption"
      data-gallery-ui
      disabled={disabled}
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
