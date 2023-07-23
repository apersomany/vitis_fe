import Router, { pop } from "svelte-spa-router";

import Landing from "./routes/home/landing.svelte";
import Hearted from "./routes/home/hearted.svelte";
import Offline from "./routes/home/offline.svelte";
import Configs from "./routes/home/configs.svelte";

import Search from "./routes/search.svelte";
import Series from "./routes/series.svelte";
import Single from "./routes/single.svelte";

import { App } from "@capacitor/app";

import "./common/styles";
import { CURRENTLY_OPEN } from "./common/states";

const routes = {
    "/landing": Landing,
    "/hearted": Hearted,
    "/offline": Offline,
    "/configs": Configs,
    "/search/:keyword?": Search,
    "/series/:series_id": Series,
    "/single/:series_id/:single_id": Single,
    "*": Landing,
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

new Router({ target: document.body, props: { routes } });
