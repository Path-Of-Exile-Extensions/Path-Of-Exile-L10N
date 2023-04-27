export namespace POEItem {
  // 一件 POE 的物品
  export type Item = {
    category: ItemCategory
    // 名称
    name: string
  }

  export enum ItemCategory {
    // 装备
    equipment,
    // 其他
    other,
  }

}
