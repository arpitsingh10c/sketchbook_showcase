import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(root, 'public');
const errors = [];

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    errors.push(`${path.relative(root, filePath)}: ${error.message}`);
    return null;
  }
}

function required(record, fields, label) {
  for (const field of fields) {
    if (record[field] === undefined || record[field] === null || record[field] === '') {
      errors.push(`${label}: missing ${field}`);
    }
  }
}

function unique(records, field, label) {
  const seen = new Set();
  for (const record of records) {
    if (seen.has(record[field])) errors.push(`${label}: duplicate ${field} "${record[field]}"`);
    seen.add(record[field]);
  }
}

async function assetExists(assetPath, label) {
  if (typeof assetPath !== 'string' || !assetPath.startsWith('/')) {
    errors.push(`${label}: asset paths must begin with /`);
    return;
  }
  try {
    await access(path.join(publicRoot, assetPath.slice(1)));
  } catch {
    errors.push(`${label}: missing asset ${assetPath}`);
  }
}

const catalogPath = path.join(publicRoot, 'content', 'catalog.json');
const catalog = await readJson(catalogPath);

if (catalog) {
  if (!Array.isArray(catalog.books)) errors.push('public/content/catalog.json: books must be an array');
  else {
    unique(catalog.books, 'id', 'catalog');
    unique(catalog.books, 'slug', 'catalog');
    unique(catalog.books, 'displayOrder', 'catalog');

    for (const summary of catalog.books) {
      const label = `catalog/${summary.slug ?? 'unknown'}`;
      required(summary, ['id', 'slug', 'title', 'description', 'coverColor', 'displayOrder', 'status', 'sketchCount'], label);
      if (!['published', 'draft'].includes(summary.status)) errors.push(`${label}: invalid status ${summary.status}`);
      if (summary.coverImage) await assetExists(summary.coverImage, `${label}/coverImage`);

      const bookPath = path.join(publicRoot, 'content', 'sketchbooks', `${summary.slug}.json`);
      const book = await readJson(bookPath);
      if (!book) continue;
      if (book.id !== summary.id) errors.push(`${label}: book id does not match catalog`);
      if (!Array.isArray(book.sketches)) {
        errors.push(`${label}: sketches must be an array`);
        continue;
      }

      unique(book.sketches, 'id', label);
      unique(book.sketches, 'displayOrder', label);
      const publishedCount = book.sketches.filter((sketch) => sketch.status === 'published').length;
      if (summary.sketchCount !== publishedCount || book.sketchCount !== publishedCount) {
        errors.push(`${label}: sketchCount must equal published sketch count (${publishedCount})`);
      }

      for (const sketch of book.sketches) {
        const sketchLabel = `${label}/${sketch.id ?? 'unknown'}`;
        required(sketch, [
          'id', 'sketchbookId', 'title', 'description', 'artworkImage', 'thumbnailImage',
          'pageTextureImage', 'originalImage', 'displayOrder', 'status',
        ], sketchLabel);
        if (sketch.sketchbookId !== book.id) errors.push(`${sketchLabel}: sketchbookId does not match ${book.id}`);
        if (!['published', 'draft'].includes(sketch.status)) errors.push(`${sketchLabel}: invalid status ${sketch.status}`);
        await Promise.all([
          assetExists(sketch.artworkImage, `${sketchLabel}/artworkImage`),
          assetExists(sketch.thumbnailImage, `${sketchLabel}/thumbnailImage`),
          assetExists(sketch.pageTextureImage, `${sketchLabel}/pageTextureImage`),
          assetExists(sketch.originalImage, `${sketchLabel}/originalImage`),
        ]);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Content validation passed for ${catalog.books.length} sketchbooks.`);
}
