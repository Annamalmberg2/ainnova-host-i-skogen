'use strict';
// Each scope owns its cache; other GitHub Pages apps share this origin.
const ROOT = new URL('./', self.location.href).href;
const PREFIX = `ainnova:${new URL(ROOT).pathname}:`;
const CACHE = PREFIX + 'v2';
const FILES = ['./', 'index.html', 'en.html', 'style.css', 'app.js', 'manifest.webmanifest', 'assets/skog.jpg', 'assets/sjon.jpg', 'assets/skord.jpg', 'assets/kantareller.jpg', 'assets/mossa.jpg', 'assets/icon-180.png', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/icon.svg', 'assets/favicon.ico'];
const URLS = FILES.map(path => new URL(path, ROOT).href);
const KNOWN = new Set(URLS);
self.addEventListener('install', event => {
  // Activation waits for existing tabs to close: no mixed releases mid-visit.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  url.search = ''; // Sharing/marketing parameters must not create extra cache entries.
  if (event.request.method !== 'GET' || !KNOWN.has(url.href)) return;
  // A complete, immutable release: fast on weak connections and available offline.
  event.respondWith(caches.open(CACHE).then(async cache => {
    const saved = await cache.match(url.href);
    if (saved) return saved;
    return fetch(event.request);
  }));
});
