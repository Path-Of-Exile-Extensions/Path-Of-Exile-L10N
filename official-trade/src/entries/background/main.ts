import {Ext, ExtMessageDirections} from "@poe-vela/core/ext";
import {DB, PreferenceService} from "@poe-vela/l10n-ext";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {clone, debounce} from "lodash-es";
import {PalmCivetService} from "@/domain/palm-civet";
import browser from "webextension-polyfill";

// const getViewData = () => {
//   return {
//     preference: PreferenceService.Instance.preference,
//   }
// }
//
// let isInitializing = false;
// let isInitialized = false;
//
// async function initialize() {
//   if (isInitialized) {
//     return Promise.resolve();
//   }
//   if (isInitializing) {
//     await new Promise(resolve => {
//       const check = () => {
//         setTimeout(() => {
//           if (isInitialized) {
//             resolve(null);
//           } else {
//             check();
//           }
//         }, 10);
//       };
//       check();
//     });
//     return;
//   }
//   isInitializing = true;
//   try {
//     await DB.Instance.initialize();
//     await PreferenceService.Instance.initialize();
//     await PalmCivetService.Instance.initialize();
//     isInitialized = true;
//   } catch (e) {
//     console.log("background initialize error", e);
//   } finally {
//     isInitializing = false;
//   }
// }
//
// Ext.on.tabMessage$(async (message) => {
//   await initialize();
//   switch (message.identify) {
//     case ExtMessagesIdentities["Query:Items"]:
//       message.payload.result = message.payload.result.map(i => {
//         if (i.item.name) {
//           i.item.name = PalmCivetService.Instance.palmCivet.full.get(i.item.name) || i.item.name
//         }
//         if (i.item.typeLine) {
//           i.item.typeLine = PalmCivetService.Instance.palmCivet.full.get(i.item.typeLine) || i.item.typeLine
//         }
//         return i;
//       })
//       break;
//     case ExtMessagesIdentities["Query:Full"]:
//       return message.payload.map(i => PalmCivetService.Instance.palmCivet.full.get(i))
//   }
//
//   return message.payload;
// })
//
// Ext.on.message(async (message) => {
//   await initialize();
//   switch (message.identify) {
//     case ExtMessagesIdentities["Preference:Update"]:
//       const old = clone(PreferenceService.Instance.preference);
//       await PreferenceService.Instance.upsert(message.payload);
//       Ext.send.multicast({
//         identify: ExtMessagesIdentities["Preference:Changed"],
//         direction: ExtMessageDirections.Runtime,
//         payload: message.payload,
//       })
//       // 如果之前没有启用翻译, 现在启用了, 则需要更新资产文件
//       if (!old.enableTranslation && PreferenceService.Instance.preference.enableTranslation) {
//         await PalmCivetService.Instance.forceUpdate();
//         Ext.send.multicast({
//           identify: ExtMessagesIdentities["PalmCivet:Updated"],
//           direction: ExtMessageDirections.Runtime,
//           payload: PalmCivetService.Instance.palmCivet,
//         })
//       }
//       return undefined;
//     case ExtMessagesIdentities["PalmCivet:Get"]:
//       return await PalmCivetService.Instance.get();
//     case ExtMessagesIdentities["PalmCivet:Update"]:
//       try {
//         await PalmCivetService.Instance.forceUpdate();
//         Ext.send.multicast({
//           identify: ExtMessagesIdentities["PalmCivet:Updated"],
//           direction: ExtMessageDirections.Runtime,
//           payload: PalmCivetService.Instance.palmCivet,
//         })
//         return true;
//       } catch (e) {
//         return false;
//       }
//     case ExtMessagesIdentities.Initialize:
//       return getViewData();
//     case ExtMessagesIdentities.Restore:
//       await PreferenceService.Instance.deleteAll();
//       await PalmCivetService.Instance.deleteAll();
//       break;
//     case ExtMessagesIdentities.Reload:
//       chrome.runtime.reload()
//   }
//
//   return undefined;
// })
//
// const reInitialize = debounce(async () => {
//   await initialize();
//   Ext.get.url()
//     .then((url) => {
//       if (!url || !url.includes("/trade/exchange")) {
//         return
//       }
//       Ext.send.message({
//         identify: ExtMessagesIdentities.ReInitialize,
//         direction: ExtMessageDirections.Tab,
//         payload: getViewData()
//       })
//       Ext.send.message({
//         identify: ExtMessagesIdentities.ReInitialize,
//         direction: ExtMessageDirections.Runtime,
//         payload: getViewData()
//       })
//     })
// }, 500)

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

// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.identify === 'test1') {
//     return undefined;
//   }
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve({response: "async response from background script2"});
//     }, 1000);
//   });
// })
//
// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.identify === 'test1') {
//     return true;
//   }
//   return new Promise(resolve => {
//     resolve({response: "async response from background script1"});
//   });
// })

Ext.messageNT.onConnect(port => {
  console.log("onRuntime", port)
  port.postMessage("frombg :back")
})
