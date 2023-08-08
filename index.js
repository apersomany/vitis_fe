import esbuild from "esbuild";
import process from "process";
import fs from "fs/promises";
import svelte from "esbuild-svelte";

try {
    await fs.mkdir("out");
} catch (e) {}

let config = {
    entryPoints: ["src/app.js", "src/svc.js", "src/manifest.json", "src/icon.png", "src/index.html", "src/model.onnx"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    outdir: "out",
    minify: process.argv[2] == "build",
    bundle: true,
    loader: {
        ".html": "copy",
        ".json": "copy",
        ".onnx": "copy",
        ".woff": "copy",
        ".ttf": "copy",
        ".eot": "copy",
        ".svg": "copy",
        ".png": "copy",
    },
    logLevel: "info",
    plugins: [svelte()],
};

switch (process.argv[2]) {
    case "build": {
        await esbuild.build(config);
        break;
    }

    case "serve": {
        let ctx = await esbuild.context(config);
        await Promise.race([ctx.watch(), ctx.serve({ servedir: "out" })]);
        break;
    }

    default: {
        console.warn("unknown action");
        break;
    }
}
