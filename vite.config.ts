// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@loadable/babel-plugin"],
      },
    }),
  ],
  define: {
    // This is a safety net for ESM
    "require.resolve": "(path) => path",
  },
  ssr: {
    // This forces Vite to process the loadable library
    // and apply the Babel transformations to it.
    noExternal: ["@loadable/component", "mobx", "mobx-react-lite"],
  },
});
