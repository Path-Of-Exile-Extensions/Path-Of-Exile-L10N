import {createApp} from "vue";
import App from "./App.vue";
import {createPinia} from 'pinia'
import renderContent from "./render-content";

const loaderEL = document.querySelector("#trade .loader")! as HTMLElement;
const observer = new MutationObserver(() => {
  if (loaderEL.style.display !== 'none') {
    observer.disconnect();
    const el = document.querySelector('body')!;
    el.insertAdjacentHTML(
      'afterend',
      '<div id="crx-app"></div>',
    );
    renderContent(
      import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
      appRoot => {
        const app = createApp(App)
        app.use(createPinia())
        app.mount(appRoot);
      }
    );

  }
})

observer.observe(document.body!, {childList: true, subtree: true})
