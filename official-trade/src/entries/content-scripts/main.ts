import {createApp} from "vue";
import App from "./App.vue";
import {createPinia} from 'pinia'
import renderContent from "./render-content";
import appPlugins from "@/components/app-plugins";
import {Ext, ExtMessage, ExtMessageDirections} from "@poe-vela/core/ext";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import browser from "webextension-polyfill";

// let timer: any
//
// function inject() {
//   renderContent(
//     import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
//     appRoot => {
//       const app = createApp(App)
//       app.use(appPlugins)
//       app.use(createPinia())
//       app.mount(appRoot);
//     }
//   );
// }
//
// timer = setInterval(() => {
//   const loaderEL = document.querySelector("#trade .loader")! as HTMLElement;
//   if (loaderEL && loaderEL.style.display === 'none') {
//     inject();
//     clearInterval(timer)
//   }
// }, 10)

// chrome.runtime.sendMessage({identify: "test1", direction: 1} as ExtMessage)
//   .then(res => {
//     console.log("main.ts", "asdasd", res)
//   })

Ext.messageNT.toRuntime("ZH", {
  identify: ExtMessagesIdentities["Query:Items"],
  payload: 222,
})

Ext.messageNT.onMessage("ZH", ExtMessageDirections.Runtime)
  .addListener(message => {
    console.log("main.ts", "接受消息", message)
  })

// window.addEventListener("message", event => {
//   if (event.data && event.data.type === "req:ASSASSIN") {
//     Ext
//       .send
//       .toRuntime$(
//         {
//           identify: ExtMessagesIdentities["Query:Items"],
//           payload: event.data.data,
//         },
//         2000
//       )
//       .catch(() => {
//         return event.data.data;
//       })
//       .then(res => {
//         window.postMessage({
//           type: "res:ASSASSIN",
//           data: JSON.stringify(res),
//           id: event.data.id,
//         }, "*")
//       })
//   }
// })

