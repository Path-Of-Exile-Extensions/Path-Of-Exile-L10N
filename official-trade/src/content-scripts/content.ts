import {createApp} from "vue";
import App from "./App.vue";

const el = document.querySelector('body');
if (el) {
  el.insertAdjacentHTML(
    'afterend',
    '<div id="crx-app"></div>',
  );
  const app = createApp(App)
  app.mount('#crx-app');
}
