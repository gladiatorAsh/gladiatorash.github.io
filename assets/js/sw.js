//importScripts('cache-polyfill.js');

const version = 0.1;
const cacheName = 'ashwebsite';

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open(cacheName).then(function(cache) {
     return cache.addAll([
       '../',
       '../index.html',
       '../index.html?homescreen=1',
       '../?homescreen=1',
       '/css/styles.css',
       '/css/theme.min.css',
       '/scripts/main.min.js',
       'core.min.js',
       'jquery-2.0.0.min.js',
       'jquery.typist.min.js',
       'plugins.js',
       '../css/bootstrap.min.css'
     ]);
   })
 );
});
