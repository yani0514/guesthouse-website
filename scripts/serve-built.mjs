// Local audit server: static files with HTTP compression, as expected from production hosting.
// This is development tooling, never an application backend or part of the deployed site.
import { createServer } from 'node:http';
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const root = resolve('dist');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};
const cache = new Map();
// Prepare compressed text before accepting requests; do not block the first visitor on compression.
for (const entry of await readdir(root, { recursive: true })) {
  if (!/\.(html|js|css|json|svg|xml|txt)$/.test(entry)) continue;
  const file = resolve(root, entry);
  const content = await readFile(file);
  cache.set(`${file}:br`, brotliCompressSync(content));
  cache.set(`${file}:gzip`, gzipSync(content));
}
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const extension = extname(file);
    const encoding = /\.(html|js|css|json|svg|xml|txt)$/.test(file)
      ? request.headers['accept-encoding']?.includes('br')
        ? 'br'
        : request.headers['accept-encoding']?.includes('gzip')
          ? 'gzip'
          : ''
      : '';
    const key = `${file}:${encoding}`;
    let data = cache.get(key);
    if (!data) {
      const content = await readFile(file);
      data =
        encoding === 'br'
          ? brotliCompressSync(content)
          : encoding === 'gzip'
            ? gzipSync(content)
            : content;
      cache.set(key, data);
    }
    response.writeHead(200, {
      'Content-Type': mime[extension] ?? 'application/octet-stream',
      'Content-Length': data.length,
      Vary: 'Accept-Encoding',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=604800',
      ...(encoding ? { 'Content-Encoding': encoding } : {}),
    });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  }
}).listen(4174, '127.0.0.1', () =>
  console.log('Compressed static audit server: http://127.0.0.1:4174'),
);
