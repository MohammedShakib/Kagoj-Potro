const CACHE_NAME = "kagoj-potro-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/favicon.ico"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  // Don't intercept API calls or processing jobs
  if (event.request.url.includes("/api/") || event.request.url.includes("/processing/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Only cache valid responses for static assets
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== "basic") {
          return fetchResponse;
        }

        // We only aggressively cache static assets like CSS, JS, and Icons
        const url = new URL(event.request.url);
        if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        
        return fetchResponse;
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
