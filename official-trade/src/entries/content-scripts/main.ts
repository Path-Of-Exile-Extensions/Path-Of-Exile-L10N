import {Ext, ExtMessageDirections, ExtMessagePortID} from "@poe-vela/core/ext";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import renderContent from "@/entries/content-scripts/render-content";
import {createApp} from "vue";
import appPlugins from "@/components/app-plugins";
import {createPinia} from "pinia";
import App from "./App.vue";

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


Ext.message.connect(ExtMessagePortID.ContentScript, ExtMessageDirections.Runtime)
// Ext.message
//   .to
//   .runtime(ExtMessagePortID.ContentScript, {
//     identify: "普通发送",
//     payload: 222,
//   })
//
// Ext.message
//   .to
//   .runtime$(ExtMessagePortID.ContentScript, {
//     identify: "Promise 发哦那个",
//     payload: "我是 content 发送的， 等待 promise.then",
//   })
//   .then(res => {
//     console.log("main.ts", "Promise", res)
//   })
//
// Ext
//   .message
//   .addListener
//   .message(ExtMessagePortID.ContentScript, ExtMessageDirections.Runtime, message => {
//     console.log("main.ts", "接受消息", message)
//   })

window.addEventListener("message", event => {
  if (event.data && event.data.type === "req:ASSASSIN") {
    Ext
      .message
      .to
      .runtime$(
        {
          identify: ExtMessagesIdentities["Query:Items"],
          payload: event.data.data,
        },
        2000
      )
      .catch(() => {
        return event.data.data;
      })
      .then(res => {
        window.postMessage({
          type: "res:ASSASSIN",
          data: JSON.stringify(res),
          id: event.data.id,
        }, "*")
      })
  }
})

