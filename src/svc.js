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
    if (url.pathname.endsWith("download/resource")) {
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
        // const root = await navigator.storage.getDirectory();
        // const name = url.searchParams.get("kid").replaceAll("/", "-").replaceAll("*", "_");
        // try {
        //     const data = await (await root.getFileHandle(`${name}.data`)).getFile();
        //     const mime = await (await root.getFileHandle(`${name}.mime`)).getFile();
        //     return new Response(data.stream(), {
        //         headers: {
        //             "content-type": await mime.text(),
        //         },
        //     });
        // } catch (e) {
        //     let res = { status: 429 };
        //     while (res.status == 429) {
        //         res = await fetch(url);
        //     }
        //     if (res.ok) {
        //         const data = await root.getFileHandle(`${name}.data`, { create: true });
        //         const mime = await root.getFileHandle(`${name}.mime`, { create: true });
        //         await res.clone().body.pipeTo(await data.createWritable());
        //         const mime_writer = await mime.createWritable();
        //         await mime_writer.write(res.headers.get("content-type"));
        //         await mime_writer.close();
        //     }
        //     return res;
        // }
    }
    return await fetch(req);
}
