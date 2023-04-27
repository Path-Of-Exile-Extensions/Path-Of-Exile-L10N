// 用贫血模型, 工具方法放到 service 中去
import {LanguageIdentities} from "../../atomic";

export type PreferenceEntity = {
  // 语言标识
  locale: LanguageIdentities;
}

export const PreferenceEntityDefault = {
  locale: LanguageIdentities["zh-hans"],
}
