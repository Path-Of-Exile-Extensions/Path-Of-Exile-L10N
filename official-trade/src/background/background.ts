import {BuiltInExtMessageIdentities, Ext, ExtMessage, ExtMessageDirections} from "@poe-vela/core";
import {DB, PreferenceService} from "@poe-vela/l10n-ext";
import Browser from "webextension-polyfill"
import {ExtMessagesIdentities} from "../classifed/ext-messages";

const onMessage = async (message: ExtMessage, sender: Browser.Runtime.MessageSender) => {
  console.log("background 收到消息", message, sender);
  switch (message.identify) {
    case BuiltInExtMessageIdentities.ContentScriptReady:
      Ext.send.message(
        {
          identify: BuiltInExtMessageIdentities.ContentScriptReadyResponse,
          payload: {
            preference: PreferenceService.Instance.preference,
          }
        },
        ExtMessageDirections.Tab,
      )
      Ext.send.message(
        {
          identify: BuiltInExtMessageIdentities.ContentScriptReadyResponse,
          payload: {
            preference: PreferenceService.Instance.preference,
          }
        },
        ExtMessageDirections.Runtime,
      )
      break;
    case ExtMessagesIdentities.UpdatePreference:
      const res = await PreferenceService.Instance.upsert(message.payload);
      Ext.send.message(
        {
          identify: ExtMessagesIdentities.OnPreferenceChanged,
          payload: res,
        },
        ExtMessageDirections.Tab,
      )
      Ext.send.message(
        {
          identify: ExtMessagesIdentities.OnPreferenceChanged,
          payload: res,
        },
        ExtMessageDirections.Runtime,
      )
  }
}

Browser.runtime.onMessage.addListener(
  (message: ExtMessage, sender) => {
    onMessage(message, sender);
    return true;
  }
);

DB.Instance.initialize()
  .then(res => {
    return PreferenceService.Instance.initialize();
  })
  .finally(() => {

  })
