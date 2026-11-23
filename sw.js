// Service worker sederhana: menyimpan "bungkus" aplikasi supaya bisa dipasang & terbuka cepat.
// Data (grafik, kalender) selalu diambil langsung dari Apps Script, tidak disimpan di sini.
const CACHE = 'komunitas-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './ikon-192.png', './ikon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Apps Script: langsung ke internet
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
