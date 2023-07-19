<script>
    export let configs;
    /** @type { { size: number; kid: string }[] } */
    export let data;

    let sorted = data.map((e) => e.size).sort((a, b) => a - b);
    let median = sorted[Math.floor(sorted.length / 2)];
    data.forEach((e, i) => {
        e.dark = i > 0 && median < 64 * 1024 && e.size < median * 2;
    });
</script>

<div class="list">
    {#each data as item}
        <img src="{configs.cdn_base}/sdownload/resource?kid={item.kid}" alt="" class={item.dark ? "dark" : ""} loading="lazy" />
    {/each}
</div>

<style>
    .list {
        display: flex;
        flex-direction: column;
        width: 100vw;
    }

    img {
        min-width: 100vw;
        min-height: 100vw;
    }
</style>
