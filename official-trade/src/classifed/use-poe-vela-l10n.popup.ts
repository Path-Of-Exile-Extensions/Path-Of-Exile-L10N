import {getCurrentInstance, onMounted, reactive} from 'vue'
import {Ext, ExtMessageDirections} from "@poe-vela/core/ext";
import {ExtMessagesIdentities} from "./ext-messages";
import {defineStore} from "pinia";
import {PreferenceEntity, PreferenceEntityDefault} from "@poe-vela/l10n-ext";


export type POEVelaL10NPopupViewState = {
  // 是否正在更新资产
  isUpdatingAssets: boolean,
  // 更新资产结果
  isUpdateAssetsResult: "none" | "success" | "fail",
  // 用户偏好
  preference: PreferenceEntity
}

const initState: POEVelaL10NPopupViewState = {
  isUpdateAssetsResult: "none",
  isUpdatingAssets: false,
  preference: PreferenceEntityDefault
}

export default defineStore('poe-vela-l10n-popup', () => {
  const state = reactive<POEVelaL10NPopupViewState>(initState)

  const actions = {
    initial(_state: { preference: PreferenceEntity }) {
      if (_state.preference) {
        state.preference = {
          ...state.preference,
          ..._state.preference,
        };
      }
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

      Ext.send.message({
        identify: ExtMessagesIdentities["Preference:Update"],
        payload: newPreference,
        direction: ExtMessageDirections.Runtime,
      })

      state.preference = newPreference;
    },
    async updateAssets() {
      state.isUpdatingAssets = true;
      Ext.send.message({
        identify: ExtMessagesIdentities["PalmCivet:Update"],
        direction: ExtMessageDirections.Runtime,
        resDirection: ExtMessageDirections.Runtime,
      })
    },
    async restore() {
      Object.assign(state, initState)
      Ext.send.multicast({
        identify: ExtMessagesIdentities.Restore,
        direction: ExtMessageDirections.Runtime,
      })
    }
  }

  if (getCurrentInstance()) {
    onMounted(async () => {
      Ext.send.message({
        identify: ExtMessagesIdentities.Initialize,
        direction: ExtMessageDirections.Runtime,
        resDirection: ExtMessageDirections.Runtime,
      })

      Ext.on.message(message => {
        switch (message.identify) {
          case ExtMessagesIdentities.ReInitialize:
            actions.initial(message.payload)
            break;
          case ExtMessagesIdentities["Preference:Changed"]:
            state.preference = message.payload;
            break;
        }
      })

      Ext.on.response(message => {
        switch (message.identify) {
          case ExtMessagesIdentities.Initialize:
            actions.initial(message.payload)
            break;
          case ExtMessagesIdentities["PalmCivet:Update"]:
            state.isUpdatingAssets = false;
            state.isUpdateAssetsResult = message.payload ? "success" : "fail"
            break;
        }
      })
    })
  }

  return {
    state: state,
    actions: actions,
  }
})
