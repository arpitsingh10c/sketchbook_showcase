import { useEffect, useState } from 'react';
import { Gallery } from './components/gallery/Gallery';
import { DescriptionPage } from './components/reader/DescriptionPage';
import { ReaderControls } from './components/reader/ReaderControls';
import { loadCatalog, loadSketchbook } from './content/loader';
import type { CatalogBook, Sketchbook } from './content/types';
import { useSketchbookStore } from './state/useSketchbookStore';

export default function App() {
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [activeBook, setActiveBook] = useState<Sketchbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state, beginOpening, finishOpening, showGallery, setPage, toggleDetails } = useSketchbookStore();

  useEffect(() => {
    loadCatalog()
      .then(({ books: catalogBooks }) => setBooks(catalogBooks))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Could not load catalog'))
      .finally(() => setLoading(false));
  }, []);

  async function openBook(slug: string) {
    if (state.inputLocked) return;
    setError(null);
    setLoading(true);
    beginOpening(slug);

    try {
      const book = await loadSketchbook(slug);
      setActiveBook(book);
      finishOpening();
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load sketchbook');
      showGallery();
    } finally {
      setLoading(false);
    }
  }

  function closeBook() {
    showGallery();
    setActiveBook(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  const sketch = activeBook?.sketches[state.pageIndex];
  const showingGallery = state.mode === 'gallery' || state.mode === 'opening' || activeBook === null;

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="wordmark" onClick={closeBook} aria-label="Return to all sketchbooks">
          SKETCHBOOK<span className="wordmark-dot">.</span>
        </button>
        <span className="header-meta">AN ONGOING VISUAL ARCHIVE</span>
      </header>

      {showingGallery ? (
        <main className="gallery-view">
          <div className="intro-copy">
            <p className="eyebrow">AN EXPLORATION IN PAPER &amp; PIXELS</p>
            <h1>Ideas worth<br /><em>keeping.</em></h1>
            <p>A collection of observations, fragments, and experiments. Choose a volume and look closer.</p>
          </div>

          {books.length > 0 && <Gallery books={books} onSelect={openBook} />}
          {!loading && !error && books.length === 0 && <p>No published sketchbooks yet.</p>}
        </main>
      ) : (
        <main className="reader-view">
          <div className="reader-heading">
            <button className="text-button" onClick={closeBook}>All sketchbooks</button>
            <div>
              <p className="eyebrow">{activeBook.title}</p>
              <h1>{sketch?.title ?? 'This book is empty'}</h1>
            </div>
            <span className="page-number">
              {sketch ? `${state.pageIndex + 1} / ${activeBook.sketches.length}` : '0 / 0'}
            </span>
          </div>

          {sketch && (
            <div className="reader-layout">
              <div className="paper-surface">
                <img src={sketch.pageTextureImage} alt={sketch.title} />
              </div>
              <aside className="reader-info">
                <DescriptionPage
                  sketch={sketch}
                  open={state.mode === 'showing-details'}
                  onToggle={toggleDetails}
                />
                <ReaderControls
                  pageIndex={state.pageIndex}
                  pageCount={activeBook.sketches.length}
                  onPrevious={() => setPage(state.pageIndex - 1)}
                  onNext={() => setPage(state.pageIndex + 1)}
                />
              </aside>
            </div>
          )}
          <p className="prototype-disclaimer">
            The physical gallery is milestone one. Continuous opening and deformable page turns follow in the next milestones.
          </p>
        </main>
      )}

      {loading && <div className="loading-notice" role="status">Loading sketchbooks…</div>}
      {error && <div className="error-notice" role="alert">{error}</div>}
      <footer>MADE FOR CURIOSITY — AN EXPERIMENTAL SKETCHBOOK EXPERIENCE</footer>
    </div>
  );
}
