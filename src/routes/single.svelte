<script>
    import { push, pop } from "svelte-spa-router";
    import { CONFIGS } from "../common/states";
    import KakaoHtml from "./single/kakao_html.svelte";
    import ImageList from "./single/image_list.svelte";

    export let params;

    let series_id = params.series_id;
    let configs = CONFIGS();

    let meta;

    async function load(single_id) {
        let resp = await fetch(`${configs.api_base}/single?series_id=${series_id}&single_id=${single_id}&free=false&wait_free=false`);
        if (resp.status == 200) {
            let json = await resp.json();
            meta = json.meta;
        } else {
            alert(await resp.text());
            await pop();
        }
    }

    $: {
        load(params.single_id);
    }
</script>

{#if meta}
    <div class="content">
        {#if meta.viewer.type == "ImageList"}
            <ImageList {configs} data={meta.viewer.data} />
        {/if}
        {#if meta.viewer.type == "KakaoHTML"}
            <KakaoHtml {configs} data={meta.viewer.data} />
        {/if}
    </div>
    <div class="footer">
        <label>
            {#if meta.prev}
                <input type="button" on:click={() => push(`/single/${series_id}/${meta.prev}`)} />
            {/if}
            <span class="mgc_arrow_left_line" style="opacity: {meta.prev ? '100%' : '50%'};" />
        </label>
        <div>{meta.title}</div>
        <label>
            {#if meta.next}
                <input type="button" on:click={() => push(`/single/${series_id}/${meta.next}`)} />
            {/if}
            <span class="mgc_arrow_right_line" style="opacity: {meta.next ? '100%' : '50%'};" />
        </label>
    </div>
{:else}
    <div class="loading">loading</div>
{/if}

<style>
    .loading {
        width: 100vw;
        height: 100vh;
    }

    .content {
        height: calc(100vh - 4rem - 1px);
        overflow: scroll;
    }

    .footer {
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
        padding: 1rem;
        font-size: 2rem;
    }
</style>
