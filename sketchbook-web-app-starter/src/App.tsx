import { useEffect, useState } from 'react';
import { GalleryCanvas } from './components/GalleryCanvas';
import { loadCatalog, loadSketchbook } from './content';
import type { CatalogBook, Sketchbook } from './types';

// The complete motion state machine and GSAP choreography are the next milestone.
type AppMode = 'gallery' | 'reading' | 'showing-details';

export default function App() {
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [activeBook, setActiveBook] = useState<Sketchbook | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [mode, setMode] = useState<AppMode>('gallery');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCatalog().then(({ books }) => setBooks(books))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load catalog'))
      .finally(() => setLoading(false));
  }, []);

  async function openBook(slug: string) {
    setError(null);
    setLoading(true);
    try {
      const book = await loadSketchbook(slug);
      setActiveBook(book);
      setPageIndex(0);
      setMode('reading');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load sketchbook');
    } finally {
      setLoading(false);
    }
  }

  const sketch = activeBook?.sketches[pageIndex];

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="wordmark" onClick={() => { setMode('gallery'); setActiveBook(null); }}>
          SKETCHBOOK<span className="wordmark-dot">.</span>
        </button>
        <span className="header-meta">AN ONGOING VISUAL ARCHIVE</span>
      </header>

      {mode === 'gallery' || activeBook === null ? (
        <main className="gallery-view">
          <div className="intro-copy">
            <p className="eyebrow">AN EXPLORATION IN PAPER & PIXELS</p>
            <h1>Ideas worth<br /><em>keeping.</em></h1>
            <p>A collection of sketches, fragments, and experiments. Open a book and explore.</p>
          </div>
          {books.length > 0 && <GalleryCanvas books={books} onSelect={openBook} />}
          {!loading && !error && books.length === 0 && <p>No published sketchbooks yet.</p>}
        </main>
      ) : (
        <main className="reader-view">
          <div className="reader-heading">
            <button className="text-button" onClick={() => { setMode('gallery'); setActiveBook(null); }}>← All sketchbooks</button>
            <div>
              <p className="eyebrow">{activeBook.title}</p>
              <h1>{sketch?.title ?? 'This book is empty'}</h1>
            </div>
            <span className="page-number">{sketch ? `${pageIndex + 1} / ${activeBook.sketches.length}` : '0 / 0'}</span>
          </div>

          {sketch && (
            <div className="reader-layout">
              <div className="paper-surface">
                <img src={sketch.pageTextureImage} alt={sketch.title} />
              </div>
              <aside className="reader-info">
                <div className="reader-info-heading">
                  <span className="eyebrow">PAGE NOTES</span>
                  <button className="text-button" onClick={() => setMode(mode === 'showing-details' ? 'reading' : 'showing-details')}>
                    {mode === 'showing-details' ? 'Hide notes −' : 'Read notes +'}
                  </button>
                </div>
                {mode === 'showing-details' && <p>{sketch.description}</p>}
                <div className="reader-navigation">
                  <button onClick={() => { setPageIndex(Math.max(0, pageIndex - 1)); setMode('reading'); }} disabled={pageIndex === 0}>← Previous</button>
                  <button onClick={() => { setPageIndex(Math.min(activeBook.sketches.length - 1, pageIndex + 1)); setMode('reading'); }} disabled={pageIndex >= activeBook.sketches.length - 1}>Next →</button>
                </div>
              </aside>
            </div>
          )}
          <p className="prototype-disclaimer">Reading mode is an accessible HTML prototype. The 3D opening, page-curling, and description-page motion are planned next.</p>
        </main>
      )}

      {loading && <div className="loading-notice" role="status">Loading sketchbooks…</div>}
      {error && <div className="error-notice" role="alert">{error}</div>}
      <footer>MADE FOR CURIOSITY — AN EXPERIMENTAL SKETCHBOOK EXPERIENCE</footer>
    </div>
  );
}
