export enum ExtMessagesIdentities {
  Translate = "Translate",
  Reload = "Reload",
  Initialize = "Initialize",
  ReInitialize = "ReInitialize",
  "Preference:Get" = "Preference:Get",
  "Preference:Update" = "Preference:Update",
  "Preference:Changed" = "Preference:Changed",
  // 客户端主动更新数据
  "PalmCivet:Update" = "PalmCivet:Update",
  // 客户端主动更新数据完成
  "PalmCivet:Updated" = "PalmCivet:Updated",
  // PalmCivet 数据发生变化, 通知 ContentScript 和 Popup
  "PalmCivet:Changed" = "PalmCivet:Changed",
  // 客户端主动获取数据
  "PalmCivet:Get" = "PalmCivet:Get",
  // 还原
  "Restore" = "Restore",
  // 测试访问资产服务器的速度
  "TestAssetServer" = "TestAssetServer",
  // 预检
  "Preflight" = "Preflight",
}

