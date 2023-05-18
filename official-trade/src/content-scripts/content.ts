import {createApp} from "vue";
import App from "./App.vue";
import {BuiltInExtMessageIdentities, Ext, ExtMessageDirections, waitSomeOne} from "@poel10n/core";

if (document.readyState !== 'loading') {
  injectPOEL10ContentScript();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    injectPOEL10ContentScript();
  });
}

function injectPOEL10ContentScript() {
  waitSomeOne("#trade")
    .then(() => {
      const el = document.querySelector('body')!;
      el.insertAdjacentHTML(
        'afterend',
        '<div id="crx-app"></div>',
      );
      const app = createApp(App)
      app.mount('#crx-app');
      Ext.send.message({identify: BuiltInExtMessageIdentities.ContentScriptReady}, ExtMessageDirections.Runtime)
    })
}
