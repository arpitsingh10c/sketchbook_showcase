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
  const {
    state,
    beginOpening,
    finishOpening,
    beginClosing,
    finishClosing,
    setPage,
    toggleDetails,
  } = useSketchbookStore();

  useEffect(() => {
    loadCatalog()
      .then(({ books: catalogBooks }) => setBooks(catalogBooks))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Could not load catalog'))
      .finally(() => setLoading(false));
  }, []);

  async function openBook(slug: string) {
    if (state.inputLocked || state.mode !== 'gallery') return;
    setError(null);
    setLoading(true);
    beginOpening(slug);

    try {
      const book = await loadSketchbook(slug);
      setActiveBook(book);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load sketchbook');
      beginClosing();
    } finally {
      setLoading(false);
    }
  }

  function closeBook() {
    if (state.inputLocked || state.mode === 'gallery') return;
    beginClosing();
  }

  function completeClose() {
    finishClosing();
    setActiveBook(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  const sketch = activeBook?.sketches[state.pageIndex];
  const readerVisible = activeBook !== null
    && (state.mode === 'reading' || state.mode === 'showing-details' || state.mode === 'closing');

  return (
    <div className="app-shell" data-mode={state.mode}>
      <header className="site-header">
        <button className="wordmark" onClick={closeBook} aria-label="Return to all sketchbooks">
          SKETCHBOOK<span className="wordmark-dot">.</span>
        </button>
        <span className="header-meta" data-gallery-ui>AN ONGOING VISUAL ARCHIVE</span>
      </header>

      <main className="experience-view" aria-busy={state.inputLocked}>
        <div className="intro-copy" data-gallery-ui>
          <p className="eyebrow">AN EXPLORATION IN PAPER &amp; PIXELS</p>
          <h1>Ideas worth<br /><em>keeping.</em></h1>
          <p>A collection of observations, fragments, and experiments. Choose a volume and look closer.</p>
        </div>

        {books.length > 0 && (
          <Gallery
            activeSlug={state.activeSlug}
            books={books}
            inputLocked={state.inputLocked}
            mode={state.mode}
            onSelect={openBook}
            onCloseComplete={completeClose}
            onOpenComplete={finishOpening}
            pageTextureUrl={sketch?.pageTextureImage}
          />
        )}
        {!loading && !error && books.length === 0 && <p>No published sketchbooks yet.</p>}

        {readerVisible && activeBook && (
          <section
            className={`reader-overlay${state.mode === 'closing' ? ' is-closing' : ''}`}
            aria-label={`${activeBook.title} reader`}
          >
            <div className="reader-overlay-heading">
              <button className="text-button reader-close" onClick={closeBook} disabled={state.inputLocked}>
                All sketchbooks
              </button>
              <div aria-live="polite">
                <p className="eyebrow">{activeBook.title}</p>
                <h1>{sketch?.title ?? 'This book is empty'}</h1>
              </div>
              <span className="page-number">
                {sketch ? `${state.pageIndex + 1} / ${activeBook.sketches.length}` : '0 / 0'}
              </span>
            </div>

            {sketch && (
              <aside className={`reader-overlay-panel${state.mode === 'showing-details' ? ' is-open' : ''}`}>
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
            )}
          </section>
        )}
      </main>

      {loading && <div className="loading-notice" role="status">Loading sketchbook…</div>}
      {error && <div className="error-notice" role="alert">{error}</div>}
      <footer data-gallery-ui>MADE FOR CURIOSITY — AN EXPERIMENTAL SKETCHBOOK EXPERIENCE</footer>
    </div>
  );
}
