const version = 0.1;
const cacheName = 'ashwebsite';

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open(cacheName).then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/index.html?homescreen=1',
       '/?homescreen=1',

       '/assets/css/styles.css',
       '/assets/css/theme.min.css',

       '/assets/files/Resume.pdf',

       '/assets/js/Resume.pdf',

       '/assets/js/core.min.js',
       '/assets/js/jquery-2.0.0.min.js',
       '/assets/js/jquery.typist.min.js',
       '/assets/js/plugins.js',
       '/scripts/main.min.js',
       
       '/css/vendor/bootstrap.min.css'
     ]);
   })
 );
});
