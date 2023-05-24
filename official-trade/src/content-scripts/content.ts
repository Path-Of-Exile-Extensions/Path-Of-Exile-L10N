import {createApp} from "vue";
import App from "./App.vue";
import {waitSomeOne} from "@poe-vela/core";
import {createPinia} from 'pinia'

if (document.readyState !== 'loading') {
  injectPOEL10ContentScript();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    injectPOEL10ContentScript();
  });
}

function injectPOEL10ContentScript() {
  const loaderEL = document.querySelector("#trade .loader")! as HTMLElement;
  const observer = new MutationObserver(() => {
    if (loaderEL.style.display !== 'none') {
      observer.disconnect();
      const el = document.querySelector('body')!;
      el.insertAdjacentHTML(
        'afterend',
        '<div id="crx-app"></div>',
      );
      const app = createApp(App)
      app.use(createPinia())
      app.mount('#crx-app');
    }
  })

  observer.observe(document.body!, {childList: true, subtree: true})
}
