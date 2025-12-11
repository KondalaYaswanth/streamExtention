import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    lib: {
      entry: "index.js",
      name: "UniversalAdSDK",
      fileName: () => "uasdk.min.js",
      formats: ["iife"]
    },
    outDir: "dist",
    emptyOutDir: true
  },

  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "configs",
          dest: "."            // copies → dist/configs
        },
        {
          src: "assets",
          dest: "."            // copies → dist/assets
        }
      ]
    })
  ]
});
