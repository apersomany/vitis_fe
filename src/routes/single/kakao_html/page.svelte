<script>
    import { onMount } from "svelte";

    export let configs;
    export let page;

    let self;

    function paragraph(parent, data) {
        let e = document.createElement(data.type);
        e.innerHTML = data.text;
        if (data.attributes) {
            for (let [key, val] of Object.entries(data.attributes)) {
                e.setAttribute(key, val);
            }
        }
        if (data.image) {
            e.src = `${configs.cdn_base}/download/resource?kid=${data.image.imageSrcKey}`;
            e.width = data.image.imageWidth;
            e.height = data.image.imageHeight;
            e.style = "width: 100%; height: 100%;";
        }
        if (data.childParagraphList) {
            for (let child_data of data.childParagraphList) {
                paragraph(e, child_data);
            }
        }
        parent.append(e);
    }

    onMount(() => {
        for (let style of page.styleList) {
            let e = document.createElement("style");
            e.setAttribute("scoped", true);
            (async () => {
                let resp = await fetch(`${configs.cdn_base}/download/resource?kid=${style.src}`);
                let text = await resp.text();
                e.innerHTML = text;
            })();
            self.append(e);
        }
        for (let data of page.paragraphList) {
            paragraph(self, data);
        }
    });
</script>

<div bind:this={self} />
