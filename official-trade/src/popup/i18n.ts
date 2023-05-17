import {createI18n, I18nOptions} from "vue-i18n";
import {LanguageIdentityModal} from "@poel10n/core";

const messages: I18nOptions["messages"] = {
  "zh": {
    message: {
      hello: '世界聚焦于你'
    },
  },
  "zh-Hant": {
    message: {
      hello: '世界聚焦於你'
    },
  },
}

const i18n = createI18n({
  locale: LanguageIdentityModal.getBrowserLanguage(),
  fallbackLocale: "en",
  messages,
})

export default i18n;
