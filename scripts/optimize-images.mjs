import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const [, , source, sketchbookSlug, sketchSlug] = process.argv;
if (!source || !sketchbookSlug || !sketchSlug) {
  console.error('Usage: npm run optimize:images -- <source.png|jpg> <sketchbook-slug> <sketch-slug>');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'public', 'assets', 'sketchbooks', sketchbookSlug, 'sketches', sketchSlug);
await mkdir(destination, { recursive: true });

function runMagick(args) {
  const result = spawnSync('magick', args, { stdio: 'inherit' });
  if (result.error?.code === 'ENOENT') {
    console.error('ImageMagick is required. Install it so the `magick` command is available.');
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

runMagick([source, '-auto-orient', '-strip', path.join(destination, 'original.png')]);
runMagick([source, '-auto-orient', '-strip', '-resize', '480x480>', '-quality', '78', path.join(destination, 'thumbnail.webp')]);
runMagick([source, '-auto-orient', '-strip', '-resize', '1800x1800>', '-quality', '84', path.join(destination, 'page.webp')]);

console.log(`Wrote image variants to ${path.relative(root, destination)}`);
