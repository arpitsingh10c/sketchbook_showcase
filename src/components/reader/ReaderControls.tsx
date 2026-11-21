interface ReaderControlsProps {
  pageIndex: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function ReaderControls({ pageIndex, pageCount, onPrevious, onNext }: ReaderControlsProps) {
  return (
    <nav className="reader-navigation" aria-label="Sketch navigation">
      <button onClick={onPrevious} disabled={pageIndex === 0}>← Previous</button>
      <button onClick={onNext} disabled={pageIndex >= pageCount - 1}>Next →</button>
    </nav>
  );
}
