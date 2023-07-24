<script>
    import { push, replace } from "svelte-spa-router";
    export let selected;
</script>

<div>
    <label>
        <input type="button" on:click={() => replace("/landing")} />
        <span class="mgc_home_4_{selected == 1 ? 'fill' : 'line'}" />
    </label>
    <label>
        <input type="button" on:click={() => replace("/hearted")} />
        <span class="mgc_heart_{selected == 2 ? 'fill' : 'line'}" />
    </label>
    <label>
        <input type="button" on:click={() => replace("/offline")} />
        <span class="mgc_folder_{selected == 3 ? 'fill' : 'line'}" />
    </label>
    <label>
        <input type="button" on:click={() => push("/search")} />
        <span class="mgc_search_{selected == 4 ? 'fill' : 'line'}" />
    </label>
    <label>
        <input type="button" on:click={() => replace("/configs")} />
        <span class="mgc_settings_1_{selected == 5 ? 'fill' : 'line'}" />
    </label>
</div>

<style>
    div {
        position: fixed;
        bottom: 0px;
        background-color: var(--card-color);
        border-top: 1px solid var(--line-color);
        height: 4rem;
        display: flex;
        overflow: hidden;
    }

    label {
        padding: 1rem 0rem 1rem 0rem;
        text-align: center;
        width: 20vw;
    }

    input {
        display: none;
    }

    span {
        padding: 1rem;
        font-size: 2rem;
    }
</style>
