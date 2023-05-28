import browser from "webextension-polyfill";
import {Ext, ExtMessageDirections} from "@poe-vela/core/ext";
import {DB, PreferenceService} from "@poe-vela/l10n-ext";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";

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
  isInitialized = true;
  return Promise.resolve()
}

Ext.on.message(async (message) => {
  console.log("background.ts: on.message", message)
  await initialize();
  switch (message.identify) {
    case ExtMessagesIdentities.UpdatePreference:
      await PreferenceService.Instance.upsert(message.payload);
      return undefined;
    case ExtMessagesIdentities.Initialize:
      return getViewData();
    case ExtMessagesIdentities.Reload:
      chrome.runtime.reload()
  }

  return undefined;
})

const reInitialize = async () => {
  await initialize();
  Ext.get.url()
    .then(async (url) => {
      if (url && url.includes("/trade/exchange")) {
        Ext.send.message({
          identify: ExtMessagesIdentities.ReInitialize,
          direction: ExtMessageDirections.Tab,
          tabId: await Ext.get.currentTabId(),
          payload: getViewData()
        })
        Ext.send.message({
          identify: ExtMessagesIdentities.ReInitialize,
          direction: ExtMessageDirections.Runtime,
          tabId: await Ext.get.currentTabId(),
          payload: getViewData()
        })
      }
    })
}

// 每次Tab切换都会调用这里的回调
chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log("chrome.tabs.onActivated")
  reInitialize();
});

// Tab创建时会调用这里的回调
chrome.tabs.onCreated.addListener(function (tab) {
  console.log("chrome.tabs.onCreated")
  reInitialize();
});
