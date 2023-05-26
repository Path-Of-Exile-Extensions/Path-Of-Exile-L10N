import browser from "webextension-polyfill";
import {BuiltInExtMessageIdentities, Ext} from "@poe-vela/core/ext";
import {DB, PreferenceService} from "@poe-vela/l10n-ext";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";

browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// 判断是否初始化过
let isInitialized = false;

async function initialize() {
  await DB.Instance.initialize()
  await PreferenceService.Instance.initialize()
  isInitialized = true;
}

Ext.on.message(async (message) => {
  console.log("background.ts: on.message", message)
  if (!isInitialized) {
    await initialize();
  }
  switch (message.identify) {
    case BuiltInExtMessageIdentities.ContentScriptReady:
      return Promise.resolve({
        preference: PreferenceService.Instance.preference,
      })
    case ExtMessagesIdentities.UpdatePreference:
      await PreferenceService.Instance.upsert(message.payload);
      return undefined;
    case ExtMessagesIdentities.GetPreference:
      return Promise.resolve(PreferenceService.Instance.preference);
    case ExtMessagesIdentities.Reload:
      chrome.runtime.reload()
  }

  return undefined;
})
