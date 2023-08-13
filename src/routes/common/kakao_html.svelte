<script>
    import Page from "./page.svelte";

    export let configs;
    /** @type { { chapter_id: number; content_id: number; kid: string }[] } */
    export let data;
    export let offline = "";

    let list;

    async function load(kid) {
        let resp = await fetch(`${configs.cdn_base}/sdownload/resource?kid=${kid}`);
        let json = await resp.json();
        return json.contentInfo;
    }

    $: if (configs.cellular) {
        list = data.filter((e) => e.chapter_id > 0);
    } else {
        list = data;
    }
</script>

<div style="font-size: {configs.size}rem;">
    {#each list as item}
        {#await load(item.kid) then page}
            <Page {configs} {page} {offline} />
        {/await}
    {/each}
</div>
