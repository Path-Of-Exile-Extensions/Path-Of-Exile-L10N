import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {getManifest} from "./src/manifest";
import webExtension from "@samrum/vite-plugin-web-extension";
import path from "path";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      vue(),
      webExtension({
        manifest: getManifest(Number(env.MANIFEST_VERSION)),
        useDynamicUrlWebAccessibleResources: false,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
