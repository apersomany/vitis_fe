<script>
    import { CONFIGS, SERIESM } from "../common/states";
    import { push } from "svelte-spa-router";

    export let params;

    let series_id = params.series_id;
    let configs = CONFIGS();
    let seriesm = SERIESM();

    let list = [];
    let page = 0;
    let more = false;
    let sort = "asc";
    let meta;
    let boxh;
    let otgt;

    async function load() {
        if (more) {
            more = false;
            let resp = await fetch(`${configs.api_base}/series?series_id=${series_id}&page=${page++}&sort=${sort}`);
            let json = await resp.json();
            if (json.meta) {
                meta = json.meta;
            }
            list = [...list, ...json.list];
            more = json.more;
        }
    }

    function nfmt(n) {
        if (n > 105000000) {
            return Math.round(n / 1000000) / 100 + "억";
        }
        if (n > 10500) {
            return Math.round(n / 1000) / 10 + "만";
        }
        return n;
    }

    $: {
        if (meta) {
            if (!seriesm[series_id]) {
                seriesm[series_id] = {
                    cover: meta.cover,
                    title: meta.title,
                    author: meta.author,
                    hearted: false,
                    last_read_time: 0,
                };
            }
        }
    }

    $: {
        if (sort) {
            list = [];
            page = 0;
            more = true;
            load();
        }
    }

    $: {
        if (otgt) {
            let iobs = new IntersectionObserver(([e]) => {
                if (e.intersectionRatio > 0) {
                    load();
                }
            });
            iobs.observe(otgt);
        }
    }
</script>

{#if meta}
    <img class="blurc" style="height: {boxh}px;" src="{configs.cdn_base}/download/resource?kid={meta.cover}&filename=th3" alt="" />
    <div class="box_1" bind:clientHeight={boxh}>
        <img class="cover" src="{configs.cdn_base}/download/resource?kid={meta.cover}&filename=th3" alt="" />
        <div class="box_4">
            <div class="title">{meta.title}</div>
            <div class="row_1">
                {meta.author.replaceAll(", ", ",").replaceAll(",", ", ")}
            </div>
            <div class="row_2">
                <span class="icon_text mgc_eye_2_fill" />
                {nfmt(meta.view_count)}
                {" · "}
                <span class="icon_text mgc_star_fill" />
                {Math.round(meta.rating * 100) / 100}
                {#if meta.pub_period}
                    {` · ${meta.pub_period} 연재`}
                {:else}
                    완결
                {/if}
            </div>
        </div>
    </div>
    <div class="box_2">
        <label>
            <input type="button" on:click={() => push(`/single/${series_id}/${seriesm[series_id].last_read_id}`)} />
            <div class="text_button" style="width: calc(100vw - 7.5rem);">
                {#if seriesm[series_id].last_read_name}
                    {seriesm[series_id].last_read_name}
                {:else}
                    첫 화 보기
                {/if}
            </div>
        </label>
        {#if seriesm[series_id].hearted}
            <label>
                <input type="button" on:click={() => (seriesm[series_id].hearted = false)} />
                <span class="icon_button mgc_heart_fill" />
            </label>
        {:else}
            <label>
                <input type="button" on:click={() => (seriesm[series_id].hearted = true)} />
                <span class="icon_button mgc_heart_line" />
            </label>
        {/if}
        <label>
            <input type="button" on:click={alert(meta.description)} />
            <span class="icon_button mgc_profile_line" />
        </label>
        {#if sort == "dsc"}
            <label>
                <input type="button" on:click={() => (sort = "asc")} />
                <span class="icon_button mgc_square_arrow_down_line" />
            </label>
        {/if}
        {#if sort == "asc"}
            <label>
                <input type="button" on:click={() => (sort = "dsc")} />
                <span class="icon_button mgc_square_arrow_up_line" />
            </label>
        {/if}
    </div>
    <div class="box_3">
        {#each list as item}
            <label>
                <input type="button" on:click={() => push(`/single/${series_id}/${item.single_id}`)} />
                <div class="box_5">
                    <img class="cover_2" src="{configs.cdn_base}/download/resource?kid={item.cover}&filename=th2" alt="" />
                    <div class="box_6">
                        <div class="title_2">{item.title}</div>
                        <div class="row_1_2">{item.row_1}</div>
                        {#if item.row_2}
                            <div class="row_2_2">{item.row_2}</div>
                        {/if}
                    </div>
                </div>
            </label>
        {/each}
        <div style="height: 1rem;" bind:this={otgt} />
    </div>
{:else}
    <div class="loading">
        <div>로딩중</div>
    </div>
{/if}

<style>
    .loading {
        display: flex;
        width: 100vw;
        height: 100vh;
        align-items: center;
        justify-content: center;
    }

    input {
        display: none;
    }

    .box_1 {
        height: 21.5rem;
        justify-content: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        background: transparent;
        backdrop-filter: var(--blur-filter);
    }

    .cover {
        border-radius: 0.5rem;
        width: 8rem;
        height: 12rem;
    }

    .blurc {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        object-fit: fill;
    }

    .box_4 {
        margin-top: 1rem;
        text-align: center;
        background: transparent;
    }

    .title {
        font-weight: 600;
        font-size: 1rem;
        background: transparent;
    }

    .row_1 {
        margin-top: 0.5rem;
        font-size: 0.8rem;
        background: transparent;
    }

    .row_2 {
        margin-top: 0.25rem;
        font-size: 0.8rem;
        background: transparent;
    }

    .icon_text {
        background: transparent;
        align-self: bottom;
    }

    .box_2 {
        display: flex;
        font-size: 0.8rem;
        height: 2.5rem;
        align-items: center;
        text-align: center;
        border-bottom: 1px solid var(--line-color);
        background: var(--back-color);
    }

    .box_3 {
        background: var(--back-color);
        position: fixed;
        top: calc(24rem + 1px);
        bottom: 0rem;
        overflow: scroll;
    }

    .icon_button {
        display: flex;
        align-items: center;
        width: 2.5rem;
        height: 2.5rem;
        justify-content: center;
        font-size: 1.5rem;
    }

    .text_button {
        font-weight: 600;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .box_5 {
        font-family: sans-serif;
        margin: 1rem;
        margin-right: 0px;
        display: flex;
        align-items: center;
    }

    .cover_2 {
        width: 4rem;
        height: 6rem;
        border-radius: 0.25rem;
    }

    .box_6 {
        width: calc(100vw - 7rem);
        margin: 1rem;
    }

    .title_2 {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-weight: 600;
        font-size: 1rem;
    }

    .row_1_2 {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 0.5rem;
        font-size: 0.8rem;
    }

    .row_2_2 {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 1rem;
        font-size: 0.8rem;
    }
</style>
