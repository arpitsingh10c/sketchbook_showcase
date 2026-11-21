import type { Catalog, Sketchbook } from './types';

const base = import.meta.env.BASE_URL;

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${base}${path.replace(/^\//, '')}`);
  if (!response.ok) throw new Error(`Failed to load ${path} (${response.status})`);
  return (await response.json()) as T;
}

export async function loadCatalog(): Promise<Catalog> {
  const catalog = await fetchJson<Catalog>('content/catalog.json');
  return {
    ...catalog,
    books: catalog.books
      .filter((book) => book.status === 'published')
      .sort((a, b) => a.displayOrder - b.displayOrder),
  };
}

export async function loadSketchbook(slug: string): Promise<Sketchbook> {
  const book = await fetchJson<Sketchbook>(`content/books/${encodeURIComponent(slug)}.json`);
  return {
    ...book,
    sketches: book.sketches
      .filter((sketch) => sketch.status === 'published')
      .sort((a, b) => a.displayOrder - b.displayOrder),
  };
}
