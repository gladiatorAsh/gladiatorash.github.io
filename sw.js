const version = 2;
const cacheName = 'ashwebsite';

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open(cacheName).then(function(cache) {
     return cache.addAll([
      'assets/css/styles.css',
      'assets/css/theme.min.css',
      'assets/css/color/blue-beige.css',
      'assets/img/photos/it-bg01.jpg',
      'assets/img/photos/testimonial-avatar01.jpg',
      'assets/js/jquery-2.0.0.min.js',
      'assets/js/plugins.js',
      'assets/js/core.min.js',
      'assets/js/jquery.typist.min.js',
      'assets/img/photos/testimonial-avatar02.jpg',
      'assets/img/photos/testimonial-avatar03.jpg',
      'assets/img/photos/testimonial-avatar05.jpg',
      'assets/img/photos/testimonial-avatar04.jpg',
      'assets/img/photos/icon127.png',
      'assets/fonts/fontawesome-webfont.woff2',
      'assets/fonts/themify.woff?-fvbane',
      'https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
      'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2',
      'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fBBc4.woff2',
      'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0'
    
    ]);
   })
 );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
});
