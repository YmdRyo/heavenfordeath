const CACHE_NAME = 'rpgmaker-cg';
const ASSETS_TO_PRECACHE = [
  "/img/pictures/%E5%B1%B1%E7%94%B0%E5%87%89%E7%AB%8B%E7%BB%981.png",
  "/img/pictures/%E8%99%B9%E5%A4%8F%E7%AB%8B%E7%BB%983.png",
  "/img/pictures/%E8%99%B9%E5%A4%8F%E7%AB%8B%E7%BB%987.png",
  "/img/pictures/CG11.png",
  "/img/pictures/%E5%B0%8F%E8%99%B9%E7%AB%8B%E7%BB%981.png",
  "/img/pictures/CG12.png",
  "/img/pictures/CG1.png",
  "/img/pictures/CG20.png",
  "/img/pictures/%E5%87%89%E7%AB%8B%E7%BB%982.png",
  "/img/pictures/sum.png",
  "/img/pictures/CG3.5.png",
  "/img/pictures/CG0.PNG",
  "/img/pictures/CG7.png",
  "/img/pictures/THX.png",
  "/img/pictures/CG14.png",
  "/img/pictures/CG5.png",
  "/img/pictures/%E8%99%B9%E5%A4%8F%E7%AB%8B%E7%BB%984.png",
  "/img/pictures/NE.png",
  "/img/pictures/%E8%99%B9%E5%A4%8F%E7%AB%8B%E7%BB%981.png",
  "/img/pictures/%E4%B8%8B%E5%8C%97%E6%B3%BD%E7%AB%8B%E7%BB%981.png",
  "/img/pictures/CG13.5.png",
  "/img/pictures/CG16.png",
  "/img/pictures/%E5%87%89%E7%AB%8B%E7%BB%985.png",
  "/img/pictures/CG10.png",
  "/img/pictures/%E9%99%84%E5%8A%A0CG.png",
  "/img/pictures/CG15.png",
  "/img/pictures/%E9%BB%91.png",
  "/img/pictures/%E8%99%B9%E5%A4%8F%E7%AB%8B%E7%BB%982.png",
  "/img/pictures/CG11.5.png",
  "/img/pictures/QQ%CD%BC%C6%AC20221223225027.jpg",
  "/img/pictures/%E5%87%89%E7%AB%8B%E7%BB%984.png",
  "/img/pictures/CG14.25.png",
  "/img/pictures/CG2.png",
  "/img/pictures/CG13.png",
  "/img/pictures/%E5%87%89%E7%AB%8B%E7%BB%983.png",
  "/img/pictures/%E8%99%B9%E5%A4%8F%E7%AB%8B%E7%BB%985.png",
  "/img/pictures/CG19.png",
  "/img/pictures/CG14.5.png",
  "/img/pictures/%E8%99%B9%E5%A4%8F%E7%AB%8B%E7%BB%986.png",
  "/img/pictures/%E5%96%9C%E5%A4%9A%E7%AB%8B%E7%BB%981.png",
  "/img/pictures/CG18.png",
  "/img/pictures/BE.png",
  "/img/pictures/CG18.5.png",
  "/img/pictures/%E6%98%9F%E6%AD%8C%E7%AB%8B%E7%BB%981.png",
  "/img/pictures/CG6.png",
  "/img/pictures/%E5%87%89%E7%AB%8B%E7%BB%981.png",
  "/img/pictures/%E4%B8%8B%E5%8C%97%E6%B3%BD%E7%AB%8B%E7%BB%982.png",
  "/img/pictures/CG0.png",
  "/img/pictures/%E5%96%9C%E5%A4%9A%E7%AB%8B%E7%BB%982.png",
  "/img/pictures/CG21.png",
  "/img/pictures/CG18.7.png",
  "/img/pictures/CG3.png",
  "/img/pictures/CG22.png",
  "/img/pictures/HE.png",
  "/img/pictures/CG4.png",
  "/img/pictures/CG8.png",
  "/img/pictures/QQ%E5%9B%BE%E7%89%8720221223225027.jpg",
  "/img/pictures/%E5%B0%8F%E8%99%B9%E7%AB%8B%E7%BB%983.png",
  "/img/pictures/CG9.png",
  "/img/pictures/%E6%98%9F%E6%AD%8C%E7%AB%8B%E7%BB%983.png",
  "/img/pictures/%E5%B0%8F%E8%99%B9%E7%AB%8B%E7%BB%982.png",
  "/img/pictures/CG18.6.png",
  "/img/pictures/CG23.png",
  "/img/pictures/CG17.png",
  "/img/pictures/%E6%98%9F%E6%AD%8C%E7%AB%8B%E7%BB%982.png",
  "/img/pictures/cn/NE.png",
  "/img/pictures/cn/BE.png",
  "/img/pictures/es/THX.png",
  "/img/pictures/es/NE.png",
  "/img/pictures/es/BE.png",
  "/img/pictures/es/HE.png",
  "/img/pictures/ru/CG7.png",
  "/img/pictures/ru/NE.png",
  "/img/pictures/ru/BE.png",
  "/img/pictures/ru/HE.png",
  "/img/note/black.png",
  "/img/note/note_bg.png",
  "/img/note/note_1.png",
  "/img/note/note_3.png",
  "/img/note/note_2.png"
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                ASSETS_TO_PRECACHE.map((url) => cache.add(url))
            );
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    if (url.includes('/img/pictures/') || url.includes('/img/note/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(event.request).then((networkResponse) => {
                        if (networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
    }
});
