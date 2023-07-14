<script>
    import { push, replace } from "svelte-spa-router";
    import { onMount } from "svelte";
    import { CONFIGS } from "../common/states";

    export let params;

    let keyword = params.keyword ? params.keyword : "";
    let configs = CONFIGS();

    let list = [];
    let page = 0;
    let more = true;
    let otgt;

    async function load() {
        if (keyword.length > 0 && more) {
            more = false;
            let resp = await fetch(`${configs.api_base}/search?keyword=${keyword}&page=${page++}`);
            let json = await resp.json();
            list = [...list, ...json.list];
            more = json.more;
        }
    }

    $: {
        if (keyword.length > 0) {
            list = [];
            page = 0;
            more = true;
            load();
        }
    }

    onMount(() => {
        let iobs = new IntersectionObserver(([e]) => {
            if (e.intersectionRatio > 0) {
                load();
            }
        });
        iobs.observe(otgt);
    });
</script>

<div class="box_1">
    {#each list as item}
        <label>
            <input type="button" on:click={push(`/series/${item.series_id}`)} />
            <div class="box_3">
                <img class="cover" src="{configs.cdn_base}/download/resource?kid={item.cover}&filename=th3" alt="" />
                <div class="box_4">
                    <div class="title">{item.title}</div>
                    <div class="row_1">{item.row_1}</div>
                    <div class="row_2">{item.row_2}</div>
                </div>
            </div>
        </label>
    {/each}
    <div style="height: 1rem;" bind:this={otgt} />
</div>
<div class="box_2">
    <input type="search" placeholder="소설을 이름으로 검색하세요" bind:value={keyword} on:input={({ target }) => replace(`/search/${target.value}`)} />
</div>

<style>
    .box_1 {
        height: calc(100vh - 4rem);
        overflow: scroll;
    }

    .box_2 {
        position: fixed;
        bottom: 0px;
        background-color: var(--card-color);
        border-top: 1px solid var(--line-color);
        height: 4rem;
    }

    input[type="button"] {
        display: none;
    }

    input[type="search"] {
        background-color: var(--back-color);
        border: 1px solid var(--line-color);
        border-radius: 0.25rem;
        padding-left: 0.75rem;
        margin: 0.5rem;
        height: 3rem;
        font-size: 1rem;
        width: calc(100vw - 1rem);
    }

    .box_3 {
        font-family: sans-serif;
        margin: 1rem;
        display: flex;
        align-items: center;
    }

    .cover {
        width: 6rem;
        height: 9rem;
        border-radius: 0.25rem;
    }

    .box_4 {
        width: calc(100vw - 10rem);
        margin: 1rem;
    }

    .title {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-weight: 600;
        font-size: 1.2rem;
    }

    .row_1 {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 0.5rem;
        font-size: 0.8rem;
    }

    .row_2 {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 1.5rem;
        font-size: 0.8rem;
    }
</style>
