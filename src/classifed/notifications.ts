import {ElNotification} from "element-plus";

export namespace Notifications {
  export const PreferenceChanged = () => {
    ElNotification.info({
      message: '[POE-Vela] 检测到配置项改变, 刷新页面后生效',
      showClose: true,
    })
  }
  export const PalmCivetChanged = () => {
    ElNotification.info({
      message: '[POE-Vela] 检测到资产数据改变, 刷新页面后生效',
      showClose: true,
    })
  }
}
