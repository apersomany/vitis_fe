<script>
    import { push } from "svelte-spa-router";
    import { CONFIGS } from "../../../common/states";

    export let serieses;

    let configs = CONFIGS();
</script>

<div class="box_1">
    {#each serieses as series}
        <label>
            <input type="button" on:click={push(`/series/${series.series_id}`)} />
            <div class="box_2">
                <img class="cover" src="{configs.cdn_base}/download/resource?kid={series.cover}&filename=th3" alt="" />
                <div class="box_3">
                    <div class="title">{series.title}</div>
                    <div class="row_1">{series.author}</div>
                    <div class="row_2">{new Date(series.last_read_time).toLocaleString()}</div>
                </div>
            </div>
        </label>
    {/each}
</div>

<style>
    .box_1 {
        height: calc(100vh - 4rem);
        overflow: scroll;
    }

    input[type="button"] {
        display: none;
    }

    .box_2 {
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

    .box_3 {
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
