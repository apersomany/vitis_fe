<script>
    export let configs;
    /** @type { { size: number; kid: string }[] } */
    export let data;
</script>

<div class="list">
    {#each data as item}
        <img src="{configs.cdn_base}/sdownload/resource?kid={item.kid}" alt="loading" />
    {/each}
</div>

<style>
    .list {
        display: flex;
        flex-direction: column;
        width: 100vw;
    }
</style>
