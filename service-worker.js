/* global self, caches, Request, fetch */

var cacheName = 'stoic-startup-0.6'
var filesToCache = [
  '/',
  'index.html',
  'service-worker.js',
  'icons/apple-touch-icon.png',
  'icons/facebook.svg',
  'icons/GitHub-Mark-Light-32px.png',
  'icons/manifest.json',
  'icons/favicon.ico',
  'icons/favicon-16x16.png',
  'icons/favicon-32x32.png',
  'icons/android-chrome-192x192.png',
  'icons/android-chrome-256x256.png',
  'icons/android-chrome-512x512.jpg'
]

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell')
      return cache.addAll(filesToCache.map(function (urlToPrefetch) {
        console.log(urlToPrefetch)
        return new Request(urlToPrefetch, { mode: 'no-cors' })
      })).catch(function (e) {
        console.log('Reqest Error', e)
      })
    })
  )
})

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function (e) {
  console.log('[ServiceWorker] Fetch', e.request)
  e.respondWith(
    caches.match(e.request).then(function (response) {
      console.log('cached? ', response)
      return response || fetch(e.request)
    })
  )
})
