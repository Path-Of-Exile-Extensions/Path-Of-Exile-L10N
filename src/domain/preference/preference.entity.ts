import {LanguageIdentities} from "@poe-vela/core/l10n";

// 用贫血模型, 工具方法放到 service 中去
export enum PresentationMode {
  // 鼠标移动到元素上时弹出
  Tooltip,
  // 直接替换为本地化语言
  Replacement,
  // 全文本显示, 这种方式也通过 Popup 弹出本地化语言
  Whole,
}

export type PreferenceEntity = {
  // 本地存储标识, 无意义
  // LocalStorage Identity, just for rxdb primary key.
  id: "1";
  // 语言标识
  language: LanguageIdentities;
  // 文本显示样式
  presentationMode: PresentationMode;
  // 是否启用翻译
  enableTranslation: boolean;
  // 是否启用自定义翻译
  enableCustomTranslation: boolean;
  // 自定义资产代理
  assetProxy?: string;
  // 自定义资产服务器
  assetServer?: string;
}

export const PreferenceEntityDefault: PreferenceEntity = {
  id: "1",
  language: LanguageIdentities["zh-Hans"],
  presentationMode: PresentationMode.Whole,
  enableTranslation: false,
  enableCustomTranslation: false,
  assetProxy: undefined,
  assetServer: `https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/`,
}
