import {getCurrentInstance, onMounted, reactive} from 'vue'
import {PreferenceEntity, PreferenceEntityDefault} from "@poe-vela/l10n-ext";
import {Ext, ExtMessageDirections} from "@poe-vela/core/ext";
import {ExtMessagesIdentities} from "./ext-messages";
import {defineStore} from "pinia";
import {AppEnv} from "@/app-env";

export type POEL10NViewState = {
  // 是否在初始化用户偏好中
  isInitingUserPreference: boolean,
  // 是否在初始化本地资产
  isInitingLocalAssets: boolean,
  // 是否有本地资产
  hasLocalAssets: boolean,
  // 是否需要更新资产
  needUpdateAssets: boolean,
  // 是否正在更新资产
  isUpdatingAssets: boolean,
  // 用户偏好
  preference: PreferenceEntity
}

export default defineStore('poe-vela-l10n', () => {
  const state = reactive<POEL10NViewState>({
    isInitingUserPreference: false,
    isInitingLocalAssets: false,
    hasLocalAssets: false,
    needUpdateAssets: false,
    isUpdatingAssets: false,
    preference: PreferenceEntityDefault
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

    /**
     * 更新用户偏好, 然后同步到本地
     * @param preference
     */
    async updatePreference(preference: Partial<PreferenceEntity>) {
      const newPreference = {
        ...state.preference,
        ...preference,
      }

      Ext.send.message(
        {
          identify: ExtMessagesIdentities.UpdatePreference,
          payload: newPreference,
          direction: ExtMessageDirections.Runtime,
          resDirection: ExtMessageDirections.Runtime,
        },
      )

      state.preference = newPreference;
      console.log("updatePreference", state.preference)
    }
  }

  if (getCurrentInstance()) {
    onMounted(async () => {
      if (AppEnv.IsContentScript) {
        Ext.send.message({
          identify: ExtMessagesIdentities.Initialize,
          direction: ExtMessageDirections.Runtime,
          resDirection: ExtMessageDirections.Tab,
        })
      } else {
        Ext.send.message({
          identify: ExtMessagesIdentities.Initialize,
          direction: ExtMessageDirections.Runtime,
          resDirection: ExtMessageDirections.Runtime,
        })
      }

      Ext.on.message(message => {
        console.log("poe-vela-l10n.ts: on.message", message)
        switch (message.identify) {
          case ExtMessagesIdentities.Initialize:
          case ExtMessagesIdentities.ReInitialize:
            actions.initial(message.payload)
            break;
        }
      })
    })
  }

  return {
    state,
    actions,
  }
})
