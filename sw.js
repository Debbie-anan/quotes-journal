const CACHE_NAME = 'quotes-journal-v5';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Dancing+Script:wght@400;700&family=Indie+Flower&family=Liu+Jian+Mao+Cao&family=Long+Cang&family=Ma+Shan+Zheng&family=Patrick+Hand&family=Shadows+Into+Light&family=ZCOOL+KuaiLe&family=ZCOOL+XiaoWei&family=Zhi+Mang+Xing&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetched = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
