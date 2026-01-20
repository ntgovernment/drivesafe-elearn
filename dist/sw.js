// sw.js - Service Worker for Drivesafe modules
const STATIC_CACHE = "drivesafe-static-v2";
const MODULES_CACHE = "drivesafe-modules-v2";
const STATIC_ASSETS = [
  "/index.html",
  "/loader.js",
  "/sw.js",
  "https://roadsafety.nt.gov.au/_media/elearning/images/header.png",
  "https://roadsafety.nt.gov.au/_media/elearning/images/walkthroughBtn.png",
  "https://roadsafety.nt.gov.au/_media/elearning/images/intro.png",
  "https://roadsafety.nt.gov.au/_media/elearning/images/m1.png",
  "https://roadsafety.nt.gov.au/_media/elearning/images/m2.png",
  "https://roadsafety.nt.gov.au/_media/elearning/images/m3.png",
  "https://roadsafety.nt.gov.au/_media/elearning/images/m4.png",
  "https://roadsafety.nt.gov.au/_media/elearning/images/m5.png",
  "https://roadsafety.nt.gov.au/_media/elearning/images/where.png",
  "https://roadsafety.nt.gov.au/_media/elearning/images/testBtn.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const requestUrl = event.request.url;

  // Check if this is a static asset (using full URL for external resources)
  const isStaticAsset = STATIC_ASSETS.some((asset) =>
    asset.startsWith("http") ? requestUrl === asset : url.pathname === asset,
  );

  if (isStaticAsset) {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then((networkResponse) => {
              // Cache the fetched resource for future use
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Return a basic error response if both cache and network fail
              return new Response("Network error occurred", {
                status: 408,
                headers: { "Content-Type": "text/plain" },
              });
            });
        }),
      ),
    );
    return;
  }

  // Cache-first strategy for module files
  event.respondWith(
    caches.open(MODULES_CACHE).then((cache) =>
      cache.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache module resources
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            return new Response("Module resource unavailable", {
              status: 408,
              headers: { "Content-Type": "text/plain" },
            });
          });
      }),
    ),
  );
});
