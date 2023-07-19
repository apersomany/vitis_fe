<script>
    import Page from "./page.svelte";

    export let configs;
    /** @type { { chapter_id: number; content_id: number; kid: string }[] } */
    export let data;

    async function load(kid) {
        let resp = await fetch(`${configs.cdn_base}/sdownload/resource?kid=${kid}`);
        let json = await resp.json();
        return json.contentInfo;
    }
</script>

<div style="font-size: {configs.size}rem;">
    {#each data as item}
        {#await load(item.kid) then page}
            <Page {configs} {page} />
        {/await}
    {/each}
</div>
