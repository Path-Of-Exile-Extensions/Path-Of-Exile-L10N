import {createI18n, I18nOptions} from "vue-i18n";
import {nextTick} from "vue";

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
  locale: 'zh-Hans',
  fallbackLocale: 'zh-Hans',
  messages,
})

export async function loadLocaleMessages(locale: string) {
  const messages = await import(`./locales/${locale}.json`)

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default)

  return nextTick()
}

export default i18n;
