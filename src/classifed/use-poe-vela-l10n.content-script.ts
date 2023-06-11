import {Ext} from "@poe-vela/core/browser";
import {ExtMessagesIdentities} from "./ext-messages";
import {defineStore} from "pinia";
import {PalmCivetModel} from "@/domain/palm-civet";
import {globalx} from "@/classifed/globalx";
import {PreferenceEntity, PreferenceEntityDefault} from "@/domain/preference";

export type POEVelaL10NViewState = {
  // 用户偏好
  preference: PreferenceEntity
  // 狸猫对象
  palmCivet: PalmCivetModel | undefined;
}

export default defineStore('poe-vela-l10n-content-script', {
  state: (): POEVelaL10NViewState => ({
    preference: PreferenceEntityDefault,
    palmCivet: undefined,
  }),
  actions: {
    initial(_state: { preference: PreferenceEntity }) {
      if (_state.preference) {
        this.preference = {
          ...this.preference,
          ..._state.preference,
        };
      }
    },
    GetPalmCivet() {
      return Ext.message
        .post$<PalmCivetModel>(globalx.port!, {identify: ExtMessagesIdentities["PalmCivet:Get"]})
        .then((res) => {
          this.palmCivet = res;
        })
    },
    restore() {
      return PalmCivetModel.restore();
    },
    /**
     * 更新用户偏好, 然后同步到本地
     */
    async updatePreference(_preference: Partial<PreferenceEntity>) {
      const newPreference = {
        ...this.preference,
        ..._preference,
      }

      Ext.message.post(
        globalx.port!,
        {identify: ExtMessagesIdentities["Preference:Update"], payload: newPreference,}
      )

      this.preference = newPreference;
    },
  },
})
