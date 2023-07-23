<script>
    import { SERIESM } from "../../common/states";
    import Content from "./common/content.svelte";
    import Library from "./common/library.svelte";
    import NavBar from "./common/nav_bar.svelte";

    let serieses = Object.entries(SERIESM())
        .map(([key, val]) => {
            return {
                series_id: key,
                ...val,
            };
        })
        .sort((a, b) => b.last_read_time - a.last_read_time);
</script>

<Content>
    <Library {serieses} />
</Content>
<NavBar selected={1} />
