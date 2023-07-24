<script>
    import { pop, push } from "svelte-spa-router";
    import { SERIESM } from "../../common/states";

    export let params;

    let series_id = params.series_id;

    let seriesm = SERIESM();

    let list = [];
    let desc = false;

    function toggle_sort() {
        desc = !desc;
        list = list.reverse();
    }

    (async () => {
        try {
            const fs = await navigator.storage.getDirectory();
            const file = await fs.getFileHandle(`${series_id}.list`);
            const text = await (await file.getFile()).text();
            list = JSON.parse(text);
        } catch (e) {
            alert(e);
            pop();
        }
    })();
</script>

<div class="box_1">
    {#each list as item}
        <label>
            <input type="button" on:click={push(`/offline/single/${series_id}/${item.single_id}`)} />
            <span class="row">{item.title}</span>
        </label>
    {/each}
</div>
<div class="box_2">
    <label>
        {#if seriesm[series_id].last_read_name}
            <input type="button" on:click={() => push(`/single/${series_id}/${seriesm[series_id].last_read_id}`)} />
            <div class="text_button" style="width: calc(100vw - 4rem);">{seriesm[series_id].last_read_name}</div>
        {:else}
            <input type="button" on:click={() => push(`/single/${series_id}/${list[0].single_id}`)} />
            <div class="text_button" style="width: calc(100vw - 4rem);">첫 화 보기</div>
        {/if}
    </label>
    {#if desc}
        <label>
            <input type="button" on:click={() => toggle_sort()} />
            <span class="icon_button mgc_square_arrow_down_line" />
        </label>
    {:else}
        <label>
            <input type="button" on:click={() => toggle_sort()} />
            <span class="icon_button mgc_square_arrow_up_line" />
        </label>
    {/if}
</div>

<style>
    input {
        display: none;
    }

    .box_1 {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 4rem - 1px);
        overflow: scroll;
    }

    .box_2 {
        display: flex;
        flex-direction: row;
        height: 4rem;
        overflow: hidden;
        background-color: var(--card-color);
        border-top: 1px solid var(--line-color);
    }

    .row {
        display: block;
        margin: 1rem;
        font-size: 1rem;
    }

    .icon_button {
        display: flex;
        align-items: center;
        width: 4rem;
        height: 4rem;
        justify-content: center;
        font-size: 2rem;
    }

    .text_button {
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
