#!/usr/bin/env node
/**
 * Minimal static server for dist/ — no Vite, no extra deps.
 * Run: node scripts/serve.js
 * Then open http://127.0.0.1:8765 in your browser.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
const DIST = path.join(__dirname, '..', 'dist');

const MIMES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let p = req.url === '/' ? '/index.html' : req.url;
  p = path.join(DIST, path.normalize(p).replace(/^(\.\.(\/|\\|$))+/, ''));
  if (!p.startsWith(DIST)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(p, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
      return;
    }
    const ext = path.extname(p);
    const ct = MIMES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', ct);
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  UUID v7 Generator is running.');
  console.log('  Open in your browser:  http://127.0.0.1:' + PORT);
  console.log('');
  console.log('  If the browser shows "connection failed":');
  console.log('  → Quit this and start the app by double-clicking run.command');
  console.log('    in Finder (do not use Cursor\'s terminal).');
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});

server.on('error', (err) => {
  console.error('Could not start server:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error('Port ' + PORT + ' is already in use. Change PORT in scripts/serve.js');
  }
  process.exit(1);
});
