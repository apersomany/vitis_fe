import Router from "svelte-spa-router";

import Landing from "./routes/home/landing.svelte";
import Hearted from "./routes/home/hearted.svelte";
import History from "./routes/home/history.svelte";
import Configs from "./routes/home/configs.svelte";

import Search from "./routes/search.svelte";
import Series from "./routes/series.svelte";
import Single from "./routes/single.svelte";

import "./common/styles";

const routes = {
    "/landing": Landing,
    "/hearted": Hearted,
    "/history": History,
    "/configs": Configs,
    "/search/:keyword?": Search,
    "/series/:series_id": Series,
    "/single/:series_id/:single_id": Single,
    "*": Landing,
};

new Router({ target: document.body, props: { routes } });
