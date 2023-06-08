import {Ext, ExtMessagePortID} from "@poe-vela/core/browser";
import renderContent from "@/entries/content-scripts/render-content";
import {createApp} from "vue";
import appPlugins from "@/components/app-plugins";
import {createPinia} from "pinia";
import App from "./App.vue";
import {globalx} from "@/classifed/globalx";
import {assassin} from "./classifed/assassin";

const port = Ext.message.connect(ExtMessagePortID.ContentScript)
globalx.port = port;

let timer: any

function inject() {
  renderContent(
    import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
    appRoot => {
      const app = createApp(App)
      app.use(appPlugins)
      app.use(createPinia())
      assassin(port)
      app.mount(appRoot);
    }
  );
}

timer = setInterval(() => {
  const loaderEL = document.querySelector("#trade .loader")! as HTMLElement;
  if (loaderEL && loaderEL.style.display === 'none') {
    inject();
    clearInterval(timer)
  }
}, 10)
