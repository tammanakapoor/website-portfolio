import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile, writeFile, copyFile, mkdir, cp } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const cache = path.join(root, '.wrangler/whimsy-home');
await mkdir(cache, { recursive: true });
const output = path.join(cache, 'scene.mjs');
await build({
  entryPoints: [path.join(root, 'app/whimsy-home.tsx')],
  outfile: output,
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
});
const { default: Scene } = await import(pathToFileURL(output).href + `?t=${Date.now()}`);
const current = await readFile(path.join(root, 'static/index.html'), 'utf8');
let head = current.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/\s*<link rel="preload" as="image"[^>]*>/g, '')
  .replace(/\s*<link rel="stylesheet" href="css\/(?:typewriter|oval-home|whimsy-home).css">/g, '');
head += '  <link rel="stylesheet" href="css/whimsy-home.css">\n';
const html = '<!DOCTYPE html>\n<html lang="en">\n<head>' + head + '</head>\n<body>\n'
  + renderToStaticMarkup(createElement(Scene, { staticSite: true }))
  + '\n<script src="js/whimsy-home.js"></script>\n</body>\n</html>\n';
const css = await readFile(path.join(root, 'app/whimsy-home.css'), 'utf8');
await writeFile(path.join(root, 'static/css/whimsy-home.css'), css.replaceAll('/media/', '../media/').replaceAll('url("/fonts/', 'url("../fonts/'));
await cp(path.join(root, 'public/media'), path.join(root, 'static/media'), { recursive: true });
await mkdir(path.join(root, 'static/fonts'), { recursive: true });
await copyFile(path.join(root, 'public/fonts/little-red-stitches.ttf'), path.join(root, 'static/fonts/little-red-stitches.ttf'));
await build({
  entryPoints: [path.join(root, 'public/whimsy-home.js')],
  outfile: path.join(root, 'static/js/whimsy-home.js'),
  bundle: true,
  format: 'iife',
  globalName: 'WhimsyHome',
  minify: true,
  footer: { js: 'WhimsyHome.initWhimsyHome(document);' },
});
// Normalize whitespace inside the bundled vendor shader strings.
const bundlePath = path.join(root, 'static/js/whimsy-home.js');
const bundle = await readFile(bundlePath, 'utf8');
await writeFile(bundlePath, bundle.replace(/[ \t]+$/gm, '').replace(/^ +\t/gm, '\t'));
await writeFile(path.join(root, 'static/index.html'), html);
console.log('Static 3D typewriter homepage generated from the shared scene, CSS and controller.');
