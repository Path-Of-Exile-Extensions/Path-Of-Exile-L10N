import {Ext, PortStore} from "@poe-vela/core/browser";
import {clone} from "lodash-es";
import initialize from "./classifed/initialize";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {PreferenceService} from "@poe-vela/l10n-ext";
import {PalmCivetService} from "@/domain/palm-civet";
import {PreflightMessageHandler} from "./message-handles";

const getViewData = () => {
  return {
    preference: PreferenceService.Instance.preference,
  }
}

let statsFlat = new Map<string, string>();

fetch("https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/master/stats.flat.min.primitive-language.json")
  .then(res => res.json())
  .then(res => {
    statsFlat = new Map(Object.entries(res));
  })

const portStore = new PortStore();

Ext.message.onConnect(port => {
  portStore.add(port);
  port.onDisconnect.addListener(() => {
    portStore.remove(port);
  })

  console.log("background.ts", "onConnect", port)
  Ext.message.addListener.message(port, async (message) => {
    console.log("background.ts", "message 接受消息", message)
    await initialize();
    switch (message.identify) {
      case ExtMessagesIdentities["Preference:Update"]:
        const old = clone(PreferenceService.Instance.preference);
        await PreferenceService.Instance.upsert(message.payload);
        Ext.message.post(
          port,
          {
            identify: ExtMessagesIdentities["Preference:Changed"],
            payload: message.payload,
          }
        )
        // 如果之前没有启用翻译, 现在启用了, 则需要更新资产文件
        if (!old.enableTranslation && PreferenceService.Instance.preference.enableTranslation) {
          await PalmCivetService.Instance.forceUpdate();
          Ext.message.multicast(
            portStore.values(),
            {
              identify: ExtMessagesIdentities["PalmCivet:Updated"],
              payload: PalmCivetService.Instance.palmCivet,
            }
          )
        }
        break;
      case ExtMessagesIdentities.Restore:
        await PreferenceService.Instance.deleteAll();
        await PalmCivetService.Instance.deleteAll();
        break;
      case ExtMessagesIdentities.Reload:
        chrome.runtime.reload()
    }

    return undefined;
  })

  Ext.message.addListener.message$(port, async (message) => {
    console.log("background.ts", "message$ 接受消息", message)
    await initialize();
    switch (message.identify) {
      case ExtMessagesIdentities["PalmCivet:Get"]:
        return await PalmCivetService.Instance.get();
      case ExtMessagesIdentities["PalmCivet:Update"]:
        await PalmCivetService.Instance.forceUpdate();
        Ext.message.multicast(
          portStore.values(),
          {
            identify: ExtMessagesIdentities["PalmCivet:Updated"],
            payload: PalmCivetService.Instance.palmCivet,
          }
        )
        return true;
      case ExtMessagesIdentities.Initialize:
        return getViewData();
      case ExtMessagesIdentities["Preflight"]:
        return new PreflightMessageHandler().handle(message, statsFlat)
    }

    return message.payload;
  })
})
