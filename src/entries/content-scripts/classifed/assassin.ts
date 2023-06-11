import {Ext} from "@poe-vela/core/browser";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {ElMessage} from "element-plus";
import browser from "webextension-polyfill";
import usePoeVelaL10nContentScript from "@/classifed/use-poe-vela-l10n.content-script";

export function assassin(port: browser.Runtime.Port) {
  window.addEventListener("message", event => {
    const poeVelaL10n = usePoeVelaL10nContentScript();
    const result = event.data?.data?.result;
    if (!result) {
      return
    }
    // 如果没有启用翻译
    if (event.data && event.data.type === "req:ASSASSIN") {
      if (!poeVelaL10n.preference.enableTranslation) {
        window.postMessage({
          type: "res:ASSASSIN",
          data: JSON.stringify({result: result}),
          id: event.data.id,
        }, "*")
        return
      }
      Ext.message
        .post$(
          port,
          {
            identify: ExtMessagesIdentities["Preflight"],
            payload: result
          },
          5000
        )
        .catch((err) => {
          const error = `[POE Vela L10N]: Connect Background Failed`
          ElMessage.warning({
            message: error,
          })
          return result
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

}
