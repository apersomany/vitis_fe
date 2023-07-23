import { LocalStorage } from "lowdb/browser";
import { LowSync } from "lowdb";
import { onDestroy } from "svelte";

export const CONFIGS_DEFAULT = {
    api_base: "https://enter-your-server.com",
    cdn_base: "https://dn-img-page.kakao.com",
    dark: false,
    size: 1.1,
    cellular: false,
    seamless: false,
};

export const CURRENTLY_OPEN = {};

function database(key, def) {
    if (!CURRENTLY_OPEN[key]) {
        CURRENTLY_OPEN[key] = new LowSync(new LocalStorage(key), def);
        CURRENTLY_OPEN[key].read();
    }
    try {
        onDestroy(() => {
            CURRENTLY_OPEN[key].write();
        });
    } catch (e) {}
    return CURRENTLY_OPEN[key].data;
}

export let SERIESM = () => database("seriesm", {});
export let SINGLEM = () => database("singlem", {});
export let OFFLINE = () => database("offline", {});
export let CONFIGS = () => {
    let db = database("configs", CONFIGS_DEFAULT);
    if (window.vitis_cdn_base) {
        db.cdn_base = window.vitis_cdn_base;
    }
    return db;
};
