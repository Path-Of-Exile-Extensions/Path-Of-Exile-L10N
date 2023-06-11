import {PalmCivetService} from "@/domain/palm-civet";
import {DbDriver} from "@poe-vela/core/repository";
import {PreferenceService} from "@/domain/preference";

let isInitializing = false;
let isInitialized = false;

export default async function initialize() {
  if (isInitialized) {
    return Promise.resolve();
  }
  if (isInitializing) {
    await new Promise(resolve => {
      const check = () => {
        setTimeout(() => {
          if (isInitialized) {
            resolve(null);
          } else {
            check();
          }
        }, 10);
      };
      check();
    });
    return;
  }
  isInitializing = true;
  try {
    await DbDriver.initialize();
    await PreferenceService.Instance.initialize();
    await PalmCivetService.Instance.initialize();
    isInitialized = true;
  } catch (e) {
    console.log("background initialize error", e);
  } finally {
    isInitializing = false;
  }
}
