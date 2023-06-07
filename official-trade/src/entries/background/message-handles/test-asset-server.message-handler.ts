import {ExtMessage} from "@poe-vela/core/browser";
import {MessageHandlerBase} from "./message-handler.base";
import {testConnectivity} from "@poe-vela/core";
import {PreferenceService} from "@poe-vela/l10n-ext";

export class TestAssetServerMessageHandler extends MessageHandlerBase {
  handle(message: ExtMessage<undefined>) {
    const preference = PreferenceService.Instance.preference;
    const url = (preference.assetProxy ? preference.assetProxy : "") + preference.assetServer + "/master//stats.flat.min.primitive-language.json";
    return testConnectivity(url)
  }
}
