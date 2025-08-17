const CACHE_NAME = 'medquiz-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache API responses for offline use
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response when offline
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgressData());
  }
});

async function syncProgressData() {
  // Get stored offline progress data
  const progressData = await getStoredProgressData();
  if (progressData.length > 0) {
    // Sync with server when online
    for (const progress of progressData) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress)
        });
      } catch (error) {
        console.log('Failed to sync progress:', error);
      }
    }
    // Clear offline storage after sync
    await clearStoredProgressData();
  }
}

async function getStoredProgressData() {
  // Implementation would depend on IndexedDB usage
  return [];
}

async function clearStoredProgressData() {
  // Implementation would depend on IndexedDB usage
}