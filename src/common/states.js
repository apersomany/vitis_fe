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
    api_base: "http://localhost:8080",
    cdn_base: "http://localhost:8080",
    dark: false,
};

export let CONFIGS = () => database("configs", CONFIGS_DEFAULT);
