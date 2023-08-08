<script>
    export let configs;
    /** @type { { size: number; kid: string }[] } */
    export let data;

    let sorted = data.map((e) => e.size).sort((a, b) => a - b);
    let median = sorted[Math.floor(sorted.length / 2)];
    if (location.hash.includes("offline")) {
        data.forEach((e) => {
            e.dark = median < 64 * 1024 && e.size < median * 2;
        });
    } else {
        data.forEach((e, i) => {
            e.dark = i > 0 && median < 64 * 1024 && e.size < median * 2;
        });
    }

    let list = data;
    $: if (configs.cellular || configs.seamless) {
        if (!location.hash.includes("offline")) {
            list = data.slice(1);
        }
    }
</script>

<div class="list">
    {#each list as item}
        <img src="http://127.0.0.1:1234/upscale?src={configs.cdn_base}/sdownload/resource?kid={item.kid}" alt="" class={item.dark ? "dark" : ""} />
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
    }
</style>
