import { defineConfig } from "tsup";
import { version } from "./package.json";

export default defineConfig([

  {
    entry: {
      oreset: "src/oreset.css",
    },
    minify: true,
    sourcemap: false,
    clean: true,
    target: "es2020",
    outDir: "dist",
    banner: {
      css: `/*! Oreset.css v${version} | MIT License | https://github.com/hilosiva/oreset.css */`,
    },
    esbuildOptions: (options) => {
      options.legalComments = "none";
    },
  },
]);
