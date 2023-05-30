import {getCurrentInstance, onMounted, reactive, watch} from 'vue'
import {Ext, ExtMessageDirections, ExtMessagePortID} from "@poe-vela/core/ext";
import {ExtMessagesIdentities} from "./ext-messages";
import {defineStore} from "pinia";
import {PreferenceEntity, PreferenceEntityDefault} from "@poe-vela/l10n-ext";
import {PalmCivetModel} from "@/domain/palm-civet";
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
      Ext.message.to
        .runtime$(
          ExtMessagePortID.ContentScript,
          {identify: ExtMessagesIdentities["PalmCivet:Get"]}
        )
        .then(res => {
          state.palmCivet = res;
        })
      Ext.message.to
        .runtime$(
          ExtMessagePortID.ContentScript,
          {identify: "一条test"}
        )
    },
    restore() {
      PalmCivetModel.restore();
    },
  }

  if (getCurrentInstance()) {
    onMounted(async () => {
      Ext.message.to
        .runtime$(
          ExtMessagePortID.ContentScript,
          {identify: ExtMessagesIdentities.Initialize,}
        )
        .then(res => {
          actions.initial(res)
        })

      Ext.message.addListener.message(ExtMessagePortID.ContentScript, ExtMessageDirections.Runtime, message => {
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
          case ExtMessagesIdentities["PalmCivet:Updated"]:
            state.palmCivet = message.payload;
        }
        return undefined;
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
