const CACHE_NAME = "nosso-cantinho-definitivo-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./media/musica.mp3",
  "./media/video.mp4",
  "./fotos/foto1.jpg",
  "./fotos/foto2.jpg",
  "./fotos/foto3.jpg",
  "./fotos/foto4.jpg",
  "./fotos/foto5.jpg",
  "./fotos/foto6.webp",
  "./fotos/foto7.jpg",
  "./fotos/foto8.jpg",
  "./fotos/foto9.jpg",
  "./fotos/foto10.jpg",
  "./fotos/foto11.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
