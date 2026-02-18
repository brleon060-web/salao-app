self.addEventListener('install', e=>{
 e.waitUntil(
   caches.open('salao-cache').then(cache=>{
     return cache.addAll(['index.html','style.css','app.js']);
   })
 );
});