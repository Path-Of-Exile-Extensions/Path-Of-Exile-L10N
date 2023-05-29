import {getCurrentInstance, onMounted, watch} from 'vue'
import {Ext, ExtMessageDirections} from "@poe-vela/core/ext";
import {ExtMessagesIdentities} from "./ext-messages";
import {defineStore} from "pinia";
import {PreferenceEntity, PreferenceEntityDefault} from "@poe-vela/l10n-ext";
import {PalmCivetModel} from "@/domain/palm-civet";
import {reactive} from "vue";
import {ElMessage} from "element-plus";

export type POEVelaL10NViewState = {
  // 用户偏好
  preference: PreferenceEntity
  // 狸猫对象
  palmCivet: PalmCivetModel | undefined;
}

export default defineStore('poe-vela-l10n-content-script', () => {
  const state = reactive<POEVelaL10NViewState>({
    preference: PreferenceEntityDefault,
    palmCivet: undefined,
  })

  const actions = {
    initial(_state: { preference: PreferenceEntity }) {
      if (_state.preference) {
        state.preference = {
          ...state.preference,
          ..._state.preference,
        };
      }
    },
    GetPalmCivet() {
      Ext.send.message({
        identify: ExtMessagesIdentities["PalmCivet:Get"],
        direction: ExtMessageDirections.Runtime,
        resDirection: ExtMessageDirections.Tab,
      })
    },
    restore() {
      PalmCivetModel.restore();
    },
  }

  if (getCurrentInstance()) {
    onMounted(async () => {
      Ext.send.message({
        identify: ExtMessagesIdentities.Initialize,
        direction: ExtMessageDirections.Runtime,
        resDirection: ExtMessageDirections.Tab,
      })

      Ext.on.message(message => {
        console.log("poe-vela-l10n content-script: on.message", message)
        switch (message.identify) {
          case ExtMessagesIdentities.ReInitialize:
            actions.initial(message.payload)
            break;
          case ExtMessagesIdentities["Preference:Changed"]:
            state.preference = message.payload;
            break;
          case ExtMessagesIdentities.Restore:
            actions.restore();
            ElMessage({
              message: '[POE-Vela] 检测到配置项改变, 刷新页面后生效',
              duration: 999999999,
              showClose: true,
            })
            break;
        }
        return undefined;
      })

      Ext.on.response(message => {
        console.log("poe-vela-l10n content-script: on.response", message)
        switch (message.identify) {
          case ExtMessagesIdentities.Initialize:
            actions.initial(message.payload)
            break;
          case ExtMessagesIdentities["PalmCivet:Get"]:
            state.palmCivet = message.payload;
            break;
          case ExtMessagesIdentities["PalmCivet:Updated"]:
            state.palmCivet = message.payload;
            break;
        }
      })
    })
  }

  watch([() => state.preference.enableTranslation, () => state.palmCivet], ([enableTranslation, palmCivet]: [boolean, (PalmCivetModel | undefined)]) => {
    if (enableTranslation) {
      if (palmCivet) {
        PalmCivetModel.substitutes(palmCivet)
      } else {
        actions.GetPalmCivet();
      }
    } else {
      actions.restore();
    }
  })

  return {
    state: state,
    actions: actions,
  }
})
