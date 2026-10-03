const CACHE_NAME = 'rpgmaker-cg-cache-v1';
const ASSETS_TO_PRECACHE = [\n  "/img/pictures/山田凉立绘1.png",\n  "/img/pictures/虹夏立绘3.png",\n  "/img/pictures/虹夏立绘7.png",\n  "/img/pictures/CG11.png",\n  "/img/pictures/小虹立绘1.png",\n  "/img/pictures/CG12.png",\n  "/img/pictures/CG1.png",\n  "/img/pictures/cn/NE.png",\n  "/img/pictures/cn/BE.png",\n  "/img/pictures/es/THX.png",\n  "/img/pictures/es/NE.png",\n  "/img/pictures/es/BE.png",\n  "/img/pictures/es/HE.png",\n  "/img/pictures/CG20.png",\n  "/img/pictures/凉立绘2.png",\n  "/img/pictures/sum.png",\n  "/img/pictures/CG3.5.png",\n  "/img/pictures/CG0.PNG",\n  "/img/pictures/CG7.png",\n  "/img/pictures/THX.png",\n  "/img/pictures/CG14.png",\n  "/img/pictures/CG5.png",\n  "/img/pictures/虹夏立绘4.png",\n  "/img/pictures/NE.png",\n  "/img/pictures/虹夏立绘1.png",\n  "/img/pictures/下北泽立绘1.png",\n  "/img/pictures/CG13.5.png",\n  "/img/pictures/CG16.png",\n  "/img/pictures/凉立绘5.png",\n  "/img/pictures/CG10.png",\n  "/img/pictures/附加CG.png",\n  "/img/pictures/CG15.png",\n  "/img/pictures/ru/CG7.png",\n  "/img/pictures/ru/NE.png",\n  "/img/pictures/ru/BE.png",\n  "/img/pictures/ru/HE.png",\n  "/img/pictures/黑.png",\n  "/img/pictures/虹夏立绘2.png",\n  "/img/pictures/CG11.5.png",\n  "/img/pictures/QQͼƬ20221223225027.jpg",\n  "/img/pictures/凉立绘4.png",\n  "/img/pictures/CG14.25.png",\n  "/img/pictures/CG2.png",\n  "/img/pictures/CG13.png",\n  "/img/pictures/凉立绘3.png",\n  "/img/pictures/虹夏立绘5.png",\n  "/img/pictures/CG19.png",\n  "/img/pictures/CG14.5.png",\n  "/img/pictures/虹夏立绘6.png",\n  "/img/pictures/喜多立绘1.png",\n  "/img/pictures/CG18.png",\n  "/img/pictures/BE.png",\n  "/img/pictures/CG18.5.png",\n  "/img/pictures/星歌立绘1.png",\n  "/img/pictures/CG6.png",\n  "/img/pictures/凉立绘1.png",\n  "/img/pictures/下北泽立绘2.png",\n  "/img/pictures/CG0.png",\n  "/img/pictures/喜多立绘2.png",\n  "/img/pictures/CG21.png",\n  "/img/pictures/CG18.7.png",\n  "/img/pictures/CG3.png",\n  "/img/pictures/CG22.png",\n  "/img/pictures/HE.png",\n  "/img/pictures/CG4.png",\n  "/img/pictures/CG8.png",\n  "/img/pictures/QQ图片20221223225027.jpg",\n  "/img/pictures/小虹立绘3.png",\n  "/img/pictures/CG9.png",\n  "/img/pictures/星歌立绘3.png",\n  "/img/pictures/小虹立绘2.png",\n  "/img/pictures/CG18.6.png",\n  "/img/pictures/CG23.png",\n  "/img/pictures/CG17.png",\n  "/img/pictures/星歌立绘2.png",\n  "/img/note/black.png",\n  "/img/note/note_bg.png",\n  "/img/note/note_1.png",\n  "/img/note/note_3.png",\n  "/img/note/note_2.png"\n];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_PRECACHE);
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
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        if (networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {});

                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});
