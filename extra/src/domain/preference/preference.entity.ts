// 用贫血模型, 工具方法放到 service 中去
export type PreferenceEntity = {
  // 语言标识
  locale: string;
}

export const PreferenceEntityDefault = {
  locale: 'zh-Hans',
}
