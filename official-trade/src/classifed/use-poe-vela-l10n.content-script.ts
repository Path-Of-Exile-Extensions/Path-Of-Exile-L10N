import {getCurrentInstance, onMounted, reactive, watch} from 'vue'
import {Ext} from "@poe-vela/core/browser";
import {ExtMessagesIdentities} from "./ext-messages";
import {defineStore} from "pinia";
import {PreferenceEntity, PreferenceEntityDefault} from "@poe-vela/l10n-ext";
import {PalmCivetModel} from "@/domain/palm-civet";
import {ElMessage} from "element-plus";
import {globalx} from "@/classifed/globalx";

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
      Ext.message
        .post$<PalmCivetModel>(globalx.port!, {identify: ExtMessagesIdentities["PalmCivet:Get"]})
        .then((res) => {
          state.palmCivet = res;
        })
    },
    restore() {
      PalmCivetModel.restore();
    },
    /**
     * 更新用户偏好, 然后同步到本地
     * @param preference
     */
    async updatePreference(preference: Partial<PreferenceEntity>) {
      const newPreference = {
        ...state.preference,
        ...preference,
      }

      Ext.message.post(
        globalx.port!,
        {identify: ExtMessagesIdentities["Preference:Update"], payload: newPreference,}
      )

      state.preference = newPreference;
    },
  }

  if (getCurrentInstance()) {
    onMounted(async () => {
      Ext.message.post$(globalx.port!, {identify: ExtMessagesIdentities.Initialize})
        .then(res => {
          actions.initial(res)
        })

      Ext.message.addListener.message(globalx.port!, message => {
        switch (message.identify) {
          case ExtMessagesIdentities.ReInitialize:
            actions.initial(message.payload)
            break;
          case ExtMessagesIdentities["Preference:Changed"]:
            state.preference = message.payload;
            break;
          case ExtMessagesIdentities["PalmCivet:Updated"]:
            state.palmCivet = message.payload;
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
