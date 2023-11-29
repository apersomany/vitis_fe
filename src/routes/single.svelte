<script>
    import { pop, replace } from "svelte-spa-router";
    import { CONFIGS, SERIESM } from "../common/states";
    import KakaoHtml from "./common/kakao_html.svelte";
    import ImageList from "./common/image_list.svelte";
    import { toggle_dark } from "../common/styles";
    import { onMount } from "svelte";

    export let params;

    export let offline;

    let series_id = params.series_id;
    let configs = CONFIGS();
    let seriesm = SERIESM();

    let show_navbar = true;
    let show_config = false;
    let meta;

    let mounted = new Promise((resolve) => onMount(resolve));
    let content;

    async function load_m(single_id) {
        if (offline) {
            const root = await navigator.storage.getDirectory();
            const file = await root.getFileHandle(`${single_id}.meta`);
            const text = await (await file.getFile()).text();
            return JSON.parse(text);
        } else {
            const resp = await fetch(`${configs.api_base}/single?series_id=${series_id}&single_id=${single_id}&free=false&wait_free=true`);
            if (resp.status == 200) {
                const json = await resp.json();
                return json.meta;
            } else {
                throw new Error(await resp.text());
            }
        }
    }

    async function render(meta) {
        switch (meta.viewer.type) {
            case "KakaoHTML": {
                return new KakaoHtml({
                    target: content,
                    props: {
                        configs: configs,
                        data: meta.viewer.data,
                        offline: offline ? "?offline" : "",
                    },
                });
            }
            case "ImageList": {
                return new ImageList({
                    target: content,
                    props: {
                        configs: configs,
                        data: meta.viewer.data,
                        offline: offline ? "?offline" : "",
                    },
                });
            }
        }
    }

    async function load_s(single_id) {
        try {
            meta = await load_m(single_id);
            await mounted;
            content.onclick = () => {
                show_navbar = !show_navbar;
            };
            if (content.children.length > 1) {
                content.children[0].remove();
            }
            await render(meta);
            const current = content.children[content.children.length - 1];
            setTimeout(() => {
                content.onscroll = () => {
                    if (current.scrollHeight - content.scrollTop < 5000) {
                        content.onscroll = () => {};
                        replace(`${offline ? "offline" : ""}/single/${series_id}/${meta.next}`);
                    }
                };
            }, 10000);
            seriesm[series_id].last_read_time = Date.now();
            seriesm[series_id].last_read_name = meta.title;
            seriesm[series_id].last_read_id = single_id;
        } catch (e) {
            alert(e);
        }
    }

    async function load_n(single_id) {
        try {
            meta = false;
            meta = await load_m(single_id);
            await mounted;
            content.onscroll = () => {};
            content.onclick = () => {
                show_navbar = !show_navbar;
            };
            content.replaceChildren();
            await render(meta);
            seriesm[series_id].last_read_time = Date.now();
            seriesm[series_id].last_read_name = meta.title;
            seriesm[series_id].last_read_id = single_id;
        } catch (e) {
            alert(e);
            await pop();
        }
    }

    $: {
        if (configs.seamless) {
            load_s(params.single_id);
        } else {
            load_n(params.single_id);
        }
    }
</script>

{#if meta}
    <div class="content" style={`height: ${show_navbar ? "calc(100vh - 4rem - 1px)" : "100vh"};`} bind:this={content} />
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
    {#if show_navbar}
        <label>
            <input type="button" on:click={() => (show_config = !show_config)} />
            <div class="footer">
                <label>
                    {#if meta.prev}
                        <input type="button" on:click={() => replace(`${offline ? "offline" : ""}/single/${series_id}/${meta.prev}`)} />
                    {/if}
                    <span class="mgc_arrow_left_line" style="opacity: {meta.prev ? '100%' : '50%'};" />
                </label>
                <div style="text-align: center;">{meta.title}</div>
                <label>
                    {#if meta.next}
                        <input type="button" on:click={() => replace(`${offline ? "offline" : ""}/single/${series_id}/${meta.next}`)} />
                    {/if}
                    <span class="mgc_arrow_right_line" style="opacity: {meta.next ? '100%' : '50%'};" />
                </label>
            </div>
        </label>
    {/if}
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
