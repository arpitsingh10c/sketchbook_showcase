interface ReaderControlsProps {
  locked: boolean;
  pageIndex: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function ReaderControls({ locked, pageIndex, pageCount, onPrevious, onNext }: ReaderControlsProps) {
  return (
    <nav className="reader-navigation" aria-label="Sketch navigation">
      <button onClick={onPrevious} disabled={locked || pageIndex === 0}>Previous</button>
      <button onClick={onNext} disabled={locked || pageIndex >= pageCount - 1}>Next</button>
    </nav>
  );
}
