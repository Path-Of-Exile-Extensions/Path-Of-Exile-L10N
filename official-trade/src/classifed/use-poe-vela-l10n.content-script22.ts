import {getCurrentInstance, onMounted, reactive, ref, shallowReactive, shallowRef, watch} from 'vue'
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
  const preference = ref(PreferenceEntityDefault)
  const palmCivet = shallowRef<PalmCivetModel | undefined>(undefined)

  const actions = {
    initial(_state: { preference: PreferenceEntity }) {
      if (_state.preference) {
        preference.value = {
          ...preference.value,
          ..._state.preference,
        };
      }
    },
    GetPalmCivet() {
      Ext.message
        .post$<PalmCivetModel>(globalx.port!, {identify: ExtMessagesIdentities["PalmCivet:Get"]})
        .then((res) => {
          palmCivet.value = res;
        })
    },
    restore() {
      PalmCivetModel.restore();
    },
    /**
     * 更新用户偏好, 然后同步到本地
     * @param _preference
     */
    async updatePreference(_preference: Partial<PreferenceEntity>) {
      const newPreference = {
        ...preference.value,
        ..._preference,
      }

      Ext.message.post(
        globalx.port!,
        {identify: ExtMessagesIdentities["Preference:Update"], payload: newPreference,}
      )

      preference.value = newPreference;
    },
  }


  return {
    preference,
    palmCivet,
    actions: actions,
  }
})
