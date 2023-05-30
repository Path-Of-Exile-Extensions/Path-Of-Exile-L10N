import {Ext, ExtMessageDirections, ExtMessagePortID} from "@poe-vela/core/ext";
import {PreferenceService} from "@poe-vela/l10n-ext";
import {PalmCivetService} from "@/domain/palm-civet";
import initialize from "./initialize";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {debounce, clone} from "lodash-es";
import {multicast} from "../../../../../Vela/src/ext/message";

const getViewData = () => {
  return {
    preference: PreferenceService.Instance.preference,
  }
}

const reInitialize = debounce(async () => {
  await initialize();
  Ext.get.url()
    .then((url) => {
      if (!url || !url.includes("/trade/exchange")) {
        return
      }
      Ext.message.to.runtime(
        ExtMessagePortID.ContentScript,
        {
          identify: ExtMessagesIdentities.ReInitialize,
          payload: getViewData()
        }
      )
    })
}, 500)

// 每次 Tab 切换都会调用这里的回调
// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   console.log("chrome.tabs.onActivated")
//   reInitialize();
// });

// Tab 创建时会调用这里的回调
// chrome.tabs.onCreated.addListener(function (tab) {
//   console.log("chrome.tabs.onCreated")
//   reInitialize();
// });

// Tab 刷新时会调用这里的回调
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   console.log("chrome.tabs.onUpdated")
//   reInitialize();
// })

Ext.message.addListener.connect(port => {
  console.log("收到连接请求", port.name)

  Ext.message.put(port.name, port)
  Ext.message.addListener.message(port, ExtMessageDirections.Runtime, async (message) => {
    await initialize();
    switch (message.identify) {
      case ExtMessagesIdentities["Preference:Update"]:
        const old = clone(PreferenceService.Instance.preference);
        await PreferenceService.Instance.upsert(message.payload);
        Ext.message.to.runtime(
          port,
          {
            identify: ExtMessagesIdentities["Preference:Changed"],
            payload: message.payload,
          }
        )
        // 如果之前没有启用翻译, 现在启用了, 则需要更新资产文件
        if (!old.enableTranslation && PreferenceService.Instance.preference.enableTranslation) {
          await PalmCivetService.Instance.forceUpdate();
          Ext.message.to.multicast(
            port,
            {
              identify: ExtMessagesIdentities["PalmCivet:Updated"],
              payload: PalmCivetService.Instance.palmCivet,
            }
          )
        }
        break;
      case ExtMessagesIdentities["PalmCivet:Update"]:
        await PalmCivetService.Instance.forceUpdate();
        Ext.message.to.multicast(
          {
            identify: ExtMessagesIdentities["PalmCivet:Updated"],
            payload: PalmCivetService.Instance.palmCivet,
          }
        )
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

  Ext.message.addListener.message$(port, ExtMessageDirections.Runtime, async (message) => {
    console.log("收到消息 $", message.identify, message)
    await initialize();
    switch (message.identify) {
      case ExtMessagesIdentities["PalmCivet:Get"]:
        return await PalmCivetService.Instance.get();
      case ExtMessagesIdentities.Initialize:
        return getViewData();
      case ExtMessagesIdentities["Query:Items"]:
        message.payload.result = message.payload.result.map(i => {
          if (i.item.name) {
            i.item.name = PalmCivetService.Instance.palmCivet.full.get(i.item.name) || i.item.name
          }
          if (i.item.typeLine) {
            i.item.typeLine = PalmCivetService.Instance.palmCivet.full.get(i.item.typeLine) || i.item.typeLine
          }
          return i;
        })
        break;
      case ExtMessagesIdentities["Query:Full"]:
        return message.payload.map(i => PalmCivetService.Instance.palmCivet.full.get(i))
    }

    return message.payload;
  })
})
