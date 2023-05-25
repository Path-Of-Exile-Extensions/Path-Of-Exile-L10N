import {reactive} from 'vue'
import {PreferenceEntity, PreferenceEntityDefault} from "@poe-vela/l10n-ext";
import {Ext, ExtMessageDirections} from "@poe-vela/core";
import {ExtMessagesIdentities} from "./ext-messages";
import {defineStore} from "pinia";

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
    // 获得字符串对象
    async findATranslation(usString: string) {
      return "";
    },

    initial({preference}: { preference: PreferenceEntity }) {
      state.preference = preference;
    },

    /**
     * 仅更新用户偏好
     * @param preference
     */
    async setPreference(preference: Partial<PreferenceEntity>) {
      const newPreference = {
        ...state.preference,
        ...preference,
      }

      state.preference = newPreference;
      console.log("popup.ts setPreference", state.preference)
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

      await Ext.send.message(
        {
          identify: ExtMessagesIdentities.UpdatePreference,
          payload: newPreference,
          direction: ExtMessageDirections.Runtime,
          resDirection: ExtMessageDirections.Runtime,
        },
      )

      state.preference = newPreference;
      console.log("popup.ts updatePreference", state.preference)
    }
  }

  return {
    state,
    actions,
  }
})
