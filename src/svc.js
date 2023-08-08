/// <reference lib="webworker" />

addEventListener("install", (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open("pwa");
            await cache.addAll(["/index.html", "/app.js", "/app.css", "/MingCute-H2SXM6HS.ttf", "/icon.png", "/manifest.json"]);
            console.log("install");
        })()
    );
});

addEventListener("fetch", (e) => {
    e.respondWith(proxy(e.request));
    e.preventDefault();
});

async function proxy(req) {
    const url = new URL(req.url);
    const pwa = await caches.open("pwa");
    const res = await pwa.match(url.pathname);
    if (res) {
        return res;
    }
    if (url.searchParams.has("offline")) {
        const cache = await caches.open("cache");
        const req = new Request(url);
        const res = await cache.match(req);
        if (res) {
            return res;
        } else {
            let res = { status: 429 };
            while (res.status == 429) {
                res = await fetch(req);
            }
            if (res.ok) {
                await cache.put(req, res.clone());
            }
            return res;
        }
    }
    return await fetch(req);
}
