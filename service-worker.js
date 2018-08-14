var cacheName = 'stoic-startup-0.1'
var filesToCache = [
  '/index.html',
  '/icons/facebook.svg',
  '/icons/GitHub-Mark-Light-32px.png',
  '/icons/manifest.json',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
  'https://connect.facebook.net/en_US/sdk.js'
]

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell')
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url)
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request)
    })
  )
});