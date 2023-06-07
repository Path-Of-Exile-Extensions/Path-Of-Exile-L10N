import {getCurrentInstance, onMounted, reactive, ref} from 'vue'
import {Ext} from "@poe-vela/core/browser";
import {ExtMessagesIdentities} from "./ext-messages";
import {defineStore} from "pinia";
import {PreferenceEntity, PreferenceEntityDefault} from "@poe-vela/l10n-ext";
import {globalx} from "@/classifed/globalx";
import {TestConnectivityResult} from "../../../../Vela/src";

export type POEVelaL10NPopupViewState = {
  // 是否正在更新资产
  isUpdatingAssets: boolean,
  // 更新资产结果
  isUpdateAssetsResult: "none" | "successful" | "failed",
  // 用户偏好
  preference: PreferenceEntity
  // 是否初始化基础数据完成
  isInitial: boolean
}

const initState: POEVelaL10NPopupViewState = {
  isUpdateAssetsResult: "none",
  isUpdatingAssets: false,
  preference: PreferenceEntityDefault,
  isInitial: false,
}

export default defineStore('poe-vela-l10n-popup', () => {
  const state = reactive<POEVelaL10NPopupViewState>(initState)
  // 测速结果
  const testConnectivityResult = ref<TestConnectivityResult | null>(null)

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

      Ext.message.post(
        globalx.port!,
        {identify: ExtMessagesIdentities["Preference:Update"], payload: newPreference,}
      )

      state.preference = newPreference;
    },
    async updateAssets() {
      state.isUpdatingAssets = true;
      return Ext.message
        .post$(
          globalx.port!,
          {identify: ExtMessagesIdentities["PalmCivet:Update"],}
        )
        .then(() => {
          state.isUpdatingAssets = false;
          state.isUpdateAssetsResult = "successful"
        })
        .catch(err => {
          state.isUpdatingAssets = false;
          state.isUpdateAssetsResult = "failed"
        })
    },
    async restore() {
      Object.assign(state, initState)
      Ext.message.post(
        globalx.port!,
        {
          identify: ExtMessagesIdentities.Restore,
        }
      )
    },
    testAssetServer() {
      return Ext.message.post$(globalx.port!, {identify: ExtMessagesIdentities.TestAssetServer})
        .then((res: TestConnectivityResult) => {
          testConnectivityResult.value = res;
          return res;
        })
    }
  }

  if (getCurrentInstance()) {
    onMounted(async () => {
      Ext.message
        .post$(globalx.port!, {identify: ExtMessagesIdentities.Initialize})
        .then(res => {
          actions.initial(res)
        })

      Ext.message.addListener.message(
        globalx.port!,
        message => {
          switch (message.identify) {
            case ExtMessagesIdentities.ReInitialize:
              actions.initial(message.payload)
              break;
            case ExtMessagesIdentities["Preference:Changed"]:
              state.preference = message.payload;
              break;
          }
        }
      )
    })
  }

  return {
    state: state,
    actions: actions,
    testConnectivityResult,
  }
})
