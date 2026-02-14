import { $ } from "bun";

// Clean and create dist
await $`rm -rf dist`;
await $`mkdir -p dist`;

// Bundle the app
await Bun.build({
  entrypoints: ["./src/app.tsx"],
  outdir: "./dist",
  minify: true,
  target: "browser",
  naming: "[name].[ext]",
});

// Build Tailwind CSS
await $`bunx @tailwindcss/cli -i ./src/style.css -o ./dist/style.css --minify`;

// Copy static files
await $`cp ./public/index.html ./dist/index.html`;

console.log("Build complete → dist/");
