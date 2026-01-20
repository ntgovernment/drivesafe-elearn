// Iframe content loader - injected into module iframes to load resources from cache
(function() {
  'use strict';
  
  const basePath = window.DRIVESAFE_BASE_PATH || '/';
  const moduleName = window.location.pathname.split('/').filter(Boolean).pop();
  
  console.log('[Module] Loading module:', moduleName, 'basePath:', basePath);
  
  // Override fetch to load from cache
  const originalFetch = window.fetch;
  window.fetch = async function(resource, options) {
    const url = typeof resource === 'string' ? resource : resource.url;
    
    // Try cache first for relative URLs
    if (!url.startsWith('http')) {
      try {
        const cache = await caches.open('drivesafe-modules-v2');
        const fullUrl = new URL(basePath + moduleName + '/' + url, window.location.origin).href;
        console.log('[Module] Fetching from cache:', fullUrl);
        const cached = await cache.match(fullUrl);
        if (cached) {
          console.log('[Module] Found in cache:', fullUrl);
          return cached;
        }
      } catch (e) {
        console.error('[Module] Cache fetch error:', e);
      }
    }
    
    return originalFetch.call(window, resource, options);
  };
  
  // Override XMLHttpRequest to load from cache
  const OriginalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new OriginalXHR();
    const originalOpen = xhr.open;
    
    xhr.open = function(method, url, ...args) {
      // Intercept relative URLs
      if (!url.startsWith('http') && !url.startsWith('//')) {
        const fullUrl = basePath + moduleName + '/' + url;
        console.log('[Module] XHR redirected to:', fullUrl);
        return originalOpen.call(this, method, fullUrl, ...args);
      }
      return originalOpen.call(this, method, url, ...args);
    };
    
    return xhr;
  };
  
  console.log('[Module] Resource interceptors installed');
})();
