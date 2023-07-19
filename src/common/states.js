import { LocalStorage } from "lowdb/browser";
import { LowSync } from "lowdb";
import { onDestroy } from "svelte";

function database(key, def) {
    let database = new LowSync(new LocalStorage(key), def);
    database.read();
    onDestroy(() => {
        database.write();
    });
    return database.data;
}

export let SERIESM = () => database("seriesm", {});
export let SINGLEM = () => database("singlem", {});

export const CONFIGS_DEFAULT = {
    api_base: "https://focuses-reduces-women-nick.trycloudflare.com",
    cdn_base: "https://focuses-reduces-women-nick.trycloudflare.com",
    dark: false,
    size: 1.1,
};

export let CONFIGS = () => database("configs", CONFIGS_DEFAULT);
