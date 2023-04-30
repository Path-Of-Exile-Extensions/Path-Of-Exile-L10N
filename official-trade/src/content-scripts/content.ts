import {createApp} from "vue";
import App from "./App.vue";
import {isPoeTrade} from "../classifed/is";
import {DB} from "@poel10n/extra";

window.onload = async () => {
  // 如果不是 poe trade 则不执行
  if (!isPoeTrade()) {
    return;
  }
  const el = document.querySelector('body');
  if (el) {
    el.insertAdjacentHTML(
      'afterend',
      '<div id="crx-app"></div>',
    );
    const app = createApp(App)
    app.mount('#crx-app');
  }
}
