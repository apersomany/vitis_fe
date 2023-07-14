<script>
    import { CONFIGS } from "../../common/states";
    import { toggle_dark } from "../../common/styles";
    import Content from "./common/content.svelte";
    import NavBar from "./common/nav_bar.svelte";

    let configs = CONFIGS();
</script>

<Content>
    <label>
        <div>API Base URL</div>
        <input type="text" bind:value={configs.api_base} />
    </label>
    <label>
        <div>CDN Base URL</div>
        <input type="text" bind:value={configs.cdn_base} />
    </label>
    <label>
        <div>Dark Mode</div>
        <input type="checkbox" on:click={toggle_dark} />
    </label>
</Content>
<NavBar selected={5} />

<style>
    label {
        display: flex;
        margin: 1rem;
        justify-content: space-between;
    }
</style>
