<script>
    import { CONFIGS, SERIESM } from "../../common/states";

    export let params;

    let series_id = params.series_id;

    let seriesm = SERIESM();
    let configs = CONFIGS();

    let meta = {};
    let more = true;
    let page = 0;
    let list = [];
    let text = "Loading single list 0/?";

    let good = [];

    async function sleep(duration) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }

    (async () => {
        while (more) {
            let resp = await fetch(`${configs.api_base}/series?series_id=${series_id}&page=${page++}&sort=asc`);
            let json = await resp.json();
            meta = json.meta;
            list = [...list, ...json.list];
            more = json.more;
            text = `Loading single list ${list.length}/?`;
            // break; debugging purposes
        }
        const exclude = new Set();
        const fs = await navigator.storage.getDirectory();
        async function writeJSON(path, json) {
            const file = await fs.getFileHandle(path, { create: true });
            const writable = await file.createWritable({ keepExistingData: false });
            await writable.write(JSON.stringify(json));
            await writable.close();
        }
        async function exists(path) {
            try {
                await fs.getFileHandle(path);
                return true;
            } catch (e) {
                return false;
            }
        }
        let counter = 0;
        for (const item of list) {
            let sleep_promise = sleep(2000);
            text = `Downloading ${item.title}`;
            if (await exists(`${item.single_id}.meta`)) {
                good.push({ single_id: item.single_id, title: item.title });
                continue;
            }
            try {
                let resp = await fetch(`${configs.api_base}/single?series_id=${series_id}&single_id=${item.single_id}&free=false`);
                if (resp.status == 200) {
                    let json = await resp.json();
                    let meta = json.meta;
                    let viewer = meta.viewer;
                    let chunks = [];
                    if (viewer.type == "ImageList") {
                        viewer.data = viewer.data.slice(1);
                        chunks = viewer.data.map((e) => `${configs.cdn_base}/sdownload/resource?kid=${e.kid}?offline`);
                    }
                    if (viewer.type == "KakaoHTML") {
                        viewer.data = viewer.data.filter((e) => e.chapter_id > 0);
                        for (const item of viewer.data) {
                            let resp = await fetch(`${configs.cdn_base}/sdownload/resource?kid=${item.kid}?offline`);
                            let json = await resp.json();
                            let page = json.contentInfo;
                            for (const style of page.styleList) {
                                chunks.push(`${configs.cdn_base}/download/resource?kid=${style.src}?offline`);
                            }
                            function paragraph(data) {
                                if (data.image) {
                                    chunks.push(`${configs.cdn_base}/download/resource?kid=${data.image.imageSrcKey}?offline`);
                                }
                                if (data.childParagraphList) {
                                    for (let child_data of data.childParagraphList) {
                                        paragraph(child_data);
                                    }
                                }
                            }
                            for (const data of page.paragraphList) {
                                paragraph(data);
                            }
                        }
                    }
                    while (chunks.length > 0) {
                        await Promise.all(chunks.splice(0, 8).map((e) => fetch(e)));
                    }
                    await writeJSON(`${item.single_id}.meta`, meta);
                    counter = 0;
                    good.push({ single_id: item.single_id, title: item.title });
                } else {
                    if (counter++ > 5) {
                        break;
                    }
                    throw new Error(await resp.text());
                }
            } catch (e) {
                alert(`Failed to download ${item.title}: ${e}`);
            }
            await sleep_promise;
        }
        await writeJSON(`${series_id}.list`, good);
        seriesm[series_id].offline = true;
        text = `Download complete`;
    })();
</script>

<div class="status">
    <div>{text}</div>
</div>

<style>
    .status {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
    }
</style>
