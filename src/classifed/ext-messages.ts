export enum ExtMessagesIdentities {
  Translate = "Translate",
  Reload = "Reload",
  Initialize = "Initialize",
  ReInitialize = "ReInitialize",
  "Preference:Get" = "Preference:Get",
  "Preference:Update" = "Preference:Update",
  "Preference:Changed" = "Preference:Changed",
  // 更新数据(差量更新)
  "PalmCivet:Update" = "PalmCivet:Update",
  // 更新数据(全量更新)
  "PalmCivet:ForceUpdate" = "PalmCivet:ForceUpdate",
  // 客户端主动更新数据完成
  "PalmCivet:Updated" = "PalmCivet:Updated",
  // 客户端主动获取数据
  "PalmCivet:Get" = "PalmCivet:Get",
  // 还原
  "Restore" = "Restore",
  // 测试访问资产服务器的速度
  "TestAssetServer" = "TestAssetServer",
  // 预检
  "Preflight" = "Preflight",
}

