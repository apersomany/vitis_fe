import Router, { pop } from "svelte-spa-router";

import History from "./routes/history.svelte";
import Hearted from "./routes/hearted.svelte";
import Offline from "./routes/offline.svelte";
import Configs from "./routes/configs.svelte";

import Search from "./routes/search.svelte";
import Series from "./routes/series.svelte";
import Single from "./routes/single.svelte";

import OfflineDownload from "./routes/offline/download.svelte";
import OfflineSeries from "./routes/offline/series.svelte";
import OfflineSingle from "./routes/offline/single.svelte";

import { App } from "@capacitor/app";

import "./common/styles";
import { CURRENTLY_OPEN, registration } from "./common/states";

const routes = {
    "/history": History,
    "/hearted": Hearted,
    "/offline": Offline,
    "/configs": Configs,
    "/search/:keyword?": Search,
    "/series/:series_id": Series,
    "/single/:series_id/:single_id": Single,
    "/offline/download/:series_id": OfflineDownload,
    "/offline/series/:series_id": OfflineSeries,
    "/offline/single/:series_id/:single_id": OfflineSingle,
    "*": History,
};

window.addEventListener("keydown", (e) => {
    if (["Escape", "Esc", "ArrowLeft"].includes(e.key)) {
        pop();
    }
});

App.addListener("backButton", () => {
    pop();
});

App.addListener("pause", () => {
    for (let key in CURRENTLY_OPEN) {
        CURRENTLY_OPEN[key].write();
    }
});

if (navigator.serviceWorker) {
    navigator.serviceWorker
        .register("/svc.js")
        .then((r) => {
            new Router({ target: document.body, props: { routes } });
        })
        .catch((e) => {
            alert("failed to load service worker: " + e);
        });
} else {
    alert("vitis cannot function without a service worker");
}

// disables cache eviction entirely
navigator.storage.persist().then((p) => {
    if (!p) {
        alert("vitis cannot function offline without persistent storage");
    }
});
