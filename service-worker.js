const CACHE = "comision-v2";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Instala la nueva versión
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
  );
});

// Elimina cachés viejas
self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>

      Promise.all(

        keys.map(key => {

          if (key !== CACHE) {
            return caches.delete(key);
          }

        })

      )

    )

  );

  self.clients.claim();

});

// Siempre intenta obtener la versión nueva
self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)

      .then(response => {

        const copia = response.clone();

        caches.open(CACHE).then(cache => {
          cache.put(event.request, copia);
        });

        return response;

      })

      .catch(() => caches.match(event.request))

  );

});
