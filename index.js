import esbuild from "esbuild";
import process from "process";
import fs from "fs/promises";
import svelte from "esbuild-svelte";

try {
    await fs.mkdir("out");
} catch (e) {}

await fs.copyFile("src/app.html", "out/index.html");

let config = {
    entryPoints: ["src/app.js"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    outdir: "out",
    minify: process.argv[2] == "build",
    bundle: true,
    loader: {
        ".woff": "copy",
        ".ttf": "copy",
        ".eot": "copy",
        ".svg": "copy",
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
