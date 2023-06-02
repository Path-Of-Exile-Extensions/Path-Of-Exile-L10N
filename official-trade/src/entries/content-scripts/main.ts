import {Ext, ExtMessagePortID} from "@poe-vela/core/browser";
import renderContent from "@/entries/content-scripts/render-content";
import {createApp} from "vue";
import appPlugins from "@/components/app-plugins";
import {createPinia} from "pinia";
import App from "./App.vue";
import {globalx} from "@/classifed/globalx";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {ElMessage} from "element-plus";
import {TradeFetchTypes} from "../../../../../Vela/src/l10n";

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

// Ext.message
//   .post(port, {
//     identify: "普通发送",
//     payload: 222,
//   })
//
// Ext.message
//   .post$(port, {
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
//   .message(port, message => {
//     console.log("main.ts", "接受消息", message)
//   })

window.addEventListener("message", event => {
  if (event.data && event.data.type === "req:ASSASSIN") {
    Ext.message
      .post$(
        port,
        {
          identify: ExtMessagesIdentities["Preflight"],
          payload: event.data.data.result as TradeFetchTypes.Result[],
        },
        2000
      )
      .catch((err) => {
        const error = `[POE Vela L10N]: Connect Background Failed`
        console.warn(error, err)
        ElMessage.warning({
          message: error,
        })
        return event.data.data.result as TradeFetchTypes.Result[];
      })
      .then(res => {
        window.postMessage({
          type: "res:ASSASSIN",
          data: JSON.stringify({result: res}),
          id: event.data.id,
        }, "*")
      })
  }
})

