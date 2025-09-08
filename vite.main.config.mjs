import { defineConfig } from "vite";
import { builtinModules } from "module";

export default defineConfig({
  envPrefix: "M_VITE_",
  build: {
    rollupOptions: {
      external: [
        ...builtinModules,
        ".prisma/client",
        "@prisma/client", // make sure Prisma stays external
      ],
    },
  },
  assetsInclude: ["**/*.prisma"],
});
