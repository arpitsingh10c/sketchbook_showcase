import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const outputDirectory = await mkdtemp(join(tmpdir(), 'sketchbook-page-turns-'));
const outputFile = join(outputDirectory, 'page-turns.test.mjs');

try {
  await build({
    bundle: true,
    entryPoints: ['tests/page-turns.test.mjs'],
    format: 'esm',
    logLevel: 'silent',
    outfile: outputFile,
    platform: 'node',
  });
  await import(pathToFileURL(outputFile).href);
} finally {
  await rm(outputDirectory, { force: true, recursive: true });
}
