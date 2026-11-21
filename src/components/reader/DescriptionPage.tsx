import type { Sketch } from '../../content/types';

interface DescriptionPageProps {
  sketch: Sketch;
  open: boolean;
  onToggle: () => void;
}

export function DescriptionPage({ sketch, open, onToggle }: DescriptionPageProps) {
  return (
    <>
      <div className="reader-info-heading">
        <span className="eyebrow">PAGE NOTES</span>
        <button className="text-button" onClick={onToggle} aria-expanded={open}>
          {open ? 'Hide notes −' : 'Read notes +'}
        </button>
      </div>
      {open && <p>{sketch.description}</p>}
    </>
  );
}
