import {createApp} from "vue";
import App from "./App.vue";
import {createPinia} from 'pinia'
import renderContent from "./render-content";
import appPlugins from "@/components/app-plugins";

let timer: any

function inject() {
  renderContent(
    import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
    appRoot => {
      const app = createApp(App)
      app.use(appPlugins)
      app.use(createPinia())
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

window.addEventListener("message", event => {
  if (event.data && event.data.type === "req:intelligence") {
    console.log("intelligence", event.data)
    event.data.data.result[0].item.name = "test"

    window.postMessage({
      type: "res:intelligence",
      data: JSON.stringify(event.data.data),
      id: event.data.id,
    }, "*")
  }
})
