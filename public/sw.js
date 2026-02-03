const CACHE_NAME = 'rezcode-v2'; // Incrementing version to force update
const ASSETS = [
  '/',
  '/manifest.json',
  '/logo.webp'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the new service worker to take over immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Force take over all tabs
  );
});

self.addEventListener('fetch', (event) => {
  // Network first for index page and data, Cache first for images/assets
  const url = new URL(event.request.url);
  
  if (url.pathname === '/' || url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
