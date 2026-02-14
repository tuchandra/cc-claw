import { $ } from "bun";
import { watch } from "fs";

async function build() {
  const start = performance.now();
  try {
    await Bun.build({
      entrypoints: ["./src/app.tsx"],
      outdir: "./dist",
      minify: false,
      target: "browser",
      naming: "[name].[ext]",
    });
    await $`bunx @tailwindcss/cli -i ./src/style.css -o ./dist/style.css`.quiet();
    await $`cp ./public/index.html ./dist/index.html`.quiet();
    console.log(`Rebuilt in ${Math.round(performance.now() - start)}ms`);
  } catch (e) {
    console.error("Build error:", e);
  }
}

await build();

// Watch for changes and rebuild
let timeout: ReturnType<typeof setTimeout> | null = null;
watch("./src", { recursive: true }, () => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(build, 100);
});
watch("./public", { recursive: true }, () => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(build, 100);
});

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = Bun.file(`./dist${path}`);
    if (await file.exists()) return new Response(file);
    return new Response(Bun.file("./dist/index.html"));
  },
});

console.log(`Dev server on http://localhost:${server.port} (watching for changes)`);
