// 为节省空间, 尽量使用简写
import {ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, RxSchema, toTypedRxJsonSchema} from "rxdb";

/**
 * 以 https://www.pathofexile.com/trade/search/Crucible/ 的 DOM 结构为基础, 尽量细化
 * 导航栏
 *  - 搜索物品
 *    - 搜索(searchPanel)
 *  - 散货交易
 *    - 搜索(searchPanel)
 *  - 设定
 *    - 搜索(searchBar)
 *  - 使用指南
 *     - 搜索(searchBar)
 * top
 *  - search-panel(搜索面板)
 *  - controls(搜索, 清除, 展开/折叠高级搜索面板)
 *
 * category 的设计目的是区分一些通用的页面元素, 例如导航栏, 搜索面板, 搜索栏等, 这些元素我会提前下载好, 以便后续使用
 * 装备名称/属性之类的, 会在用户搜索时, 动态下载并且缓存到本地
 * 为了语义化元素我对 category 做了两个大分组, 整个取值范围为 0 ~ 2^32
 * 1. 通用
 * 2. 特定
 * 通用的元素 category 值从 1 开始, 到 2^1 结束, 特定的元素 category 值从 2^31 开始, 到 2^32 结束
 *
 */
export const enum CharacterCategory {
  // 导航栏
  common = 1,
  // 属性
  attribute = 2,
}

// 每个最小文本都会被生成一个 Character 结构体, 用于存储到本地
export type Character = {
  // 本地化的字符串
  c: string;
  // 原始英文字符串
  u: string;
  // 分类
  cat: CharacterCategory;
};

