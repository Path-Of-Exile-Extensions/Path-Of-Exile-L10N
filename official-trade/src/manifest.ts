import pkg from '../package.json'

const sharedManifest = {
  name: "POE Vela Trade L10N",
  description: "A Path Of Exile Official Trade Website I10N Extension",
  version: pkg.version,
  permissions: [
    "storage",
    "unlimitedStorage",
    "activeTab",
    "background"
  ],
  content_scripts: [
    {
      matches: [
        "https://www.pathofexile.com/trade/*",
      ],
      js: [
        "src/entries/content-scripts/ASSASSIN.js",
        "src/entries/content-scripts/main.ts",
      ],
      css: [
        // 处理 Shadow dom, 这里手动引入 element-plus 的样式
        "src/components/element-ui.css"
      ],
      run_at: "document_start"
    }
  ],
  options_ui: {
    page: "src/entries/options/index.html",
    open_in_tab: true,
  },
}


const browserAction = {
  default_icon: {
    16: "icons/icon16.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png"
  },
  default_popup: "src/entries/popup/index.html",
};

const ManifestV2 = {
  ...sharedManifest,
  background: {
    scripts: ["src/entries/background/script.ts"],
    persistent: true,
  },
  browser_action: browserAction,
  options_ui: {
    ...sharedManifest.options_ui,
    chrome_style: false,
  },
  permissions: [...sharedManifest.permissions, "*://*/*"],
};

const ManifestV3 = {
  ...sharedManifest,
  action: browserAction,
  background: {
    service_worker: "src/entries/background/serviceWorker.ts",
  },
  host_permissions: ["*://*/*"],
};

export function getManifest(manifestVersion: number): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {

  if (manifestVersion === 2) {
    return {
      ...ManifestV2,
      manifest_version: manifestVersion,
    } as chrome.runtime.ManifestV2;
  }

  if (manifestVersion === 3) {
    return {
      ...ManifestV3,
      manifest_version: manifestVersion,
    } as chrome.runtime.ManifestV3;
  }

  throw new Error(
    `Missing manifest definition for manifestVersion ${manifestVersion}`
  );
}
