<script>
    import { pop, replace } from "svelte-spa-router";
    import { CONFIGS, SERIESM } from "../../common/states";
    import { toggle_dark } from "../../common/styles";
    import ImageList from "../common/image_list.svelte";
    import KakaoHtml from "../common/kakao_html.svelte";

    export let params;

    let series_id = params.series_id;

    let seriesm = SERIESM();
    let configs = CONFIGS();

    let show_config = false;
    let meta;

    async function load(single_id) {
        try {
            meta = undefined;
            const root = await navigator.storage.getDirectory();
            const file = await root.getFileHandle(`${single_id}.meta`);
            const text = await (await file.getFile()).text();
            meta = JSON.parse(text);
            seriesm[series_id].last_read_time = Date.now();
            seriesm[series_id].last_read_name = meta.title;
            seriesm[series_id].last_read_id = single_id;
        } catch (e) {
            alert(e);
            pop();
        }
    }
    $: {
        load(params.single_id);
    }
</script>

{#if meta}
    <div class="content">
        {#if meta.viewer.type == "ImageList"}
            <ImageList {configs} data={meta.viewer.data} offline={"?offline"} />
        {/if}
        {#if meta.viewer.type == "KakaoHTML"}
            <KakaoHtml {configs} data={meta.viewer.data} offline={"?offline"} />
        {/if}
    </div>
    <div class="config" style="display: {show_config ? 'flex' : 'none'}">
        <label>
            <input type="button" on:click={toggle_dark} />
            <span class="mgc_moon_fill" />
        </label>
        <label>
            <input type="button" on:click={() => (configs.size -= 0.1)} />
            <span class="mgc_fullscreen_exit_2_line" />
        </label>
        <label>
            <input type="button" on:click={() => (configs.size += 0.1)} />
            <span class="mgc_fullscreen_2_line" />
        </label>
        <label>
            <input type="button" on:click={() => (configs.cellular = !configs.cellular)} />
            <span class="mgc_transfer_2_{configs.cellular ? 'fill' : 'line'}" />
        </label>
        <label>
            <input type="button" on:click={() => (configs.seamless = !configs.seamless)} />
            <span class="mgc_fast_forward_{configs.seamless ? 'fill' : 'line'}" />
        </label>
    </div>
    <label>
        <input type="button" on:click={() => (show_config = !show_config)} />
        <div class="footer">
            <label>
                {#if meta.prev}
                    <input type="button" on:click={() => replace(`/offline/single/${series_id}/${meta.prev}`)} />
                {/if}
                <span class="mgc_arrow_left_line" style="opacity: {meta.prev ? '100%' : '50%'};" />
            </label>
            <div style="text-align: center;">{meta.title}</div>
            <label>
                {#if meta.next}
                    <input type="button" on:click={() => replace(`/offline/single/${series_id}/${meta.next}`)} />
                {/if}
                <span class="mgc_arrow_right_line" style="opacity: {meta.next ? '100%' : '50%'};" />
            </label>
        </div>
    </label>
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

    .content {
        height: calc(100vh - 4rem - 1px);
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .footer {
        position: sticky;
        bottom: 0px;
        overflow: hidden;
        background-color: var(--card-color);
        justify-content: space-between;
        align-items: center;
        width: 100vw;
        height: 4rem;
        display: flex;
        border-top: 1px solid var(--line-color);
        flex-direction: row;
    }

    input {
        display: none;
    }

    span {
        background-color: var(--card-color);
        border-radius: 0.5rem;
        padding: 1rem;
        font-size: 2rem;
        display: inline-block;
    }

    .config {
        border-radius: 0.5rem;
        position: sticky;
        bottom: 5rem;
        left: 1rem;
        width: calc(100vw - 2rem);
        background-color: var(--card-color);
        border: 1px solid var(--line-color);
    }

    .config > label {
        display: flex;
        width: calc(100% / 5);
        justify-content: center;
        background-color: transparent;
    }
</style>
