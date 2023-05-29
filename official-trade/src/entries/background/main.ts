import {Ext, ExtMessageDirections} from "@poe-vela/core/ext";
import {DB, PreferenceService} from "@poe-vela/l10n-ext";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {debounce} from "lodash-es";
import {PalmCivetService} from "@/domain/palm-civet";

const getViewData = () => {
  return {
    preference: PreferenceService.Instance.preference,
  }
}

// 判断是否初始化过
let isInitialized = false;

async function initialize() {
  if (isInitialized) {
    return Promise.resolve();
  }
  await DB.Instance.initialize()
  await PreferenceService.Instance.initialize()
  await PalmCivetService.Instance.initialize()
  isInitialized = true;
  return Promise.resolve()
}

Ext.on.message(async (message) => {
  console.log("background.ts: on.message", message)
  await initialize();
  switch (message.identify) {
    case ExtMessagesIdentities["Preference:Update"]:
      await PreferenceService.Instance.upsert(message.payload);
      Ext.send.multicast({
        identify: ExtMessagesIdentities["Preference:Changed"],
        direction: ExtMessageDirections.Runtime,
        payload: message.payload,
      })
      return undefined;
    case ExtMessagesIdentities["PalmCivet:Get"]:
      return await PalmCivetService.Instance.get();
    case ExtMessagesIdentities["PalmCivet:Update"]:
      try {
        await PalmCivetService.Instance.forceUpdate();
        Ext.send.multicast({
          identify: ExtMessagesIdentities["PalmCivet:Updated"],
          direction: ExtMessageDirections.Runtime,
          payload: PalmCivetService.Instance.palmCivet,
        })
        return true;
      } catch (e) {
        return false;
      }
    case ExtMessagesIdentities.Initialize:
      return getViewData();
    case ExtMessagesIdentities.Restore:
      await PreferenceService.Instance.deleteAll();
      await PalmCivetService.Instance.deleteAll();
      break;
    case ExtMessagesIdentities.Reload:
      chrome.runtime.reload()
  }

  return undefined;
})

const reInitialize = debounce(async () => {
  await initialize();
  Ext.get.url()
    .then((url) => {
      if (!url || !url.includes("/trade/exchange")) {
        return
      }
      Ext.send.message({
        identify: ExtMessagesIdentities.ReInitialize,
        direction: ExtMessageDirections.Tab,
        payload: getViewData()
      })
      Ext.send.message({
        identify: ExtMessagesIdentities.ReInitialize,
        direction: ExtMessageDirections.Runtime,
        payload: getViewData()
      })
    })
}, 500)

// 每次 Tab 切换都会调用这里的回调
chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log("chrome.tabs.onActivated")
  reInitialize();
});

// Tab 创建时会调用这里的回调
chrome.tabs.onCreated.addListener(function (tab) {
  console.log("chrome.tabs.onCreated")
  reInitialize();
});

// Tab 刷新时会调用这里的回调
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("chrome.tabs.onUpdated")
  reInitialize();
})
