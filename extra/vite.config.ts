import {defineConfig} from 'vite'
// @ts-ignore No Problem 
import path from "path";
import dts from 'vite-plugin-dts'

export default defineConfig(({mode}) => {
  return {
    plugins: [
      dts()
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'umd'],
        name: "poel10n-extra"
      },
      outDir: "./lib",
    },
  }
})
