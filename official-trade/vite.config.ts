import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import { crx } from '@crxjs/vite-plugin'
// @ts-ignore
import manifest from './manifest.json'

export default defineConfig(({mode}) => {
  return {
    plugins: [
      vue(),
      crx({
        manifest: manifest
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    build: {
      emptyOutDir: mode == 'production',
      target: 'chrome110',
      minify: mode == 'production'
    },
  }
})
