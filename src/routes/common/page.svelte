<script>
    import { onMount } from "svelte";

    export let configs;
    export let page;

    let head;
    let body;

    function paragraph(parent, data) {
        if (data.type == "TEXT") {
            let e = document.createElement("div");
            e.innerHTML = data.text;
            parent.append(document.createTextNode(e.innerText));
        } else {
            let e = document.createElement(data.type);
            e.innerHTML = data.text;
            if (data.attributes && !(data.image && data.image.isCover)) {
                for (let [key, val] of Object.entries(data.attributes)) {
                    switch (key) {
                        case "width": {
                            e.setAttribute(key, "100%");
                            break;
                        }
                        case "height": {
                            break;
                        }
                        default: {
                            e.setAttribute(key, val);
                        }
                    }
                }
            }
            if (data.image) {
                if (data.image.isCover) {
                    e = document.createElement("div");
                    let f = document.createElement("img");
                    f.src = `${configs.cdn_base}/download/resource?kid=${data.image.imageSrcKey}`;
                    f.style = `width: calc(100vw - 4rem);`;
                    e.append(f);
                } else {
                    e.src = `${configs.cdn_base}/download/resource?kid=${data.image.imageSrcKey}`;
                    e.style = `max-width: calc(100vw - 4rem); ${e.style ? e.style : ""}`;
                }
            }
            if (data.childParagraphList) {
                for (let child_data of data.childParagraphList) {
                    paragraph(e, child_data);
                }
            }
            parent.append(e);
        }
    }

    onMount(() => {
        for (let style of page.styleList) {
            let e = document.createElement("link");
            e.rel = "stylesheet";
            e.type = "text/css";
            e.href = `${configs.cdn_base}/download/resource?kid=${style.src}`;
            head.append(e);
        }
        for (let data of page.paragraphList) {
            paragraph(body, data);
        }
    });
</script>

<div style="margin: 2rem;">
    <div bind:this={head} />
    <div bind:this={body} />
</div>
