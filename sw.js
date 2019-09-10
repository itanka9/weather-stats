'use strict';

const cacheName = 'statics',
    cacheVersion = '3',

    cacheContent = [
        '/funlib.js',
        '/streams.js',
        '/store.js',
        '/chart.js',
        '/ui.js',
        '/index.js',
        '/index.html',
        '/'
    ];

function getCacheName () {
    return [cacheName, cacheVersion].join('::')
}

function updateStaticCache() {
    return caches.open(getCacheName())
        .then(function (cache) {
            return cache.addAll(cacheContent);
        });
};

function invalidateCaches() {
    return caches.keys()
        .then(function (keys) {
            return Promise.all(keys
                .filter(function (key) {
                    return key.indexOf('::' + version) !== 0;
                })
                .map(function (key) {
                    return caches.delete(key);
                })
            );
        });
}

function proxyRequests (event) {
    const request = event.request;
    if (request.method !== 'GET') {
        event.respondWith(fetch(request));
        return;
    }

    if (request.headers.get('Accept').indexOf('text/html') !== -1) {
        // Fix for Chrome bug: https://code.google.com/p/chromium/issues/detail?id=573937
        if (request.mode != 'navigate') {
            request = new Request(request.url, {
                method: 'GET',
                headers: request.headers,
                mode: request.mode,
                credentials: request.credentials,
                redirect: request.redirect
            });
        }
        event.respondWith(
            fetch(request)
                .then(function (response) {
                    var copy = response.clone();
                    caches.open(getCacheName())
                        .then(function (cache) {
                            cache.put(request, copy);
                        });
                    return response;
                })
                .catch(function () {
                    return caches.match(request);
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(function (response) {
                return response || fetch(request);
            })
    );
}

self.addEventListener('install', function (event) {
    event.waitUntil(updateStaticCache());
});

self.addEventListener('fetch', proxyRequests);

self.addEventListener('activate', function (event) {
    event.waitUntil(invalidateCaches());
});