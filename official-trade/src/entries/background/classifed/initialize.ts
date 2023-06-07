import {DB, PreferenceService} from "@poe-vela/l10n-ext";
import {PalmCivetService} from "@/domain/palm-civet";

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
    await DB.Instance.initialize();
    await PreferenceService.Instance.initialize();
    await PalmCivetService.Instance.initialize();
    isInitialized = true;
  } catch (e) {
    console.log("background initialize error", e);
  } finally {
    isInitializing = false;
  }
}
