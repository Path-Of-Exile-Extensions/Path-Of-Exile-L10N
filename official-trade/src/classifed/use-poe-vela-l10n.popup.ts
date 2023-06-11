import { defineStore } from 'pinia';
import { Ext } from '@poe-vela/core/browser';
import { ExtMessagesIdentities } from './ext-messages';
import { globalx } from '@/classifed/globalx';
import { executeAtLeast, TestConnectivityResult } from '@poe-vela/core';
import {PreferenceEntity, PreferenceEntityDefault} from "@/domain/preference";

export type POEVelaL10NPopupViewState = {
  // 是否正在更新资产
  isUpdatingAssets: boolean;
  // 更新资产结果
  isUpdateAssetsResult: 'none' | 'successful' | 'failed';
  // 用户偏好
  preference: PreferenceEntity;
  // 是否初始化基础数据完成
  isInitial: boolean;
  testConnectivityResult: TestConnectivityResult | null
};

const getInitState = (): POEVelaL10NPopupViewState => ({
  isUpdateAssetsResult: 'none',
  isUpdatingAssets: false,
  preference: PreferenceEntityDefault,
  isInitial: false,
  testConnectivityResult: null
});

export default defineStore('poe-vela-l10n-popup', {
  state() {
    return getInitState();
  },
  actions: {
    initial(_state: { preference: PreferenceEntity }) {
      if (_state.preference) {
        this.preference = {
          ...this.preference,
          ..._state.preference,
        };
      }
      this.isInitial = true;
    },

    /**
     * 更新用户偏好, 然后同步到本地
     * @param preference
     */
    async updatePreference(preference: Partial<PreferenceEntity>) {
      const newPreference = {
        ...this.preference,
        ...preference,
      };

      Ext.message.post(globalx.port!, {
        identify: ExtMessagesIdentities['Preference:Update'],
        payload: newPreference,
      });

      this.preference = newPreference;
    },
    async updateAssets() {
      this.isUpdatingAssets = true;
      return Ext.message
        .post$(globalx.port!, {
          identify: ExtMessagesIdentities['PalmCivet:ForceUpdate'],
        })
        .then(() => {
          this.isUpdatingAssets = false;
          this.isUpdateAssetsResult = 'successful';
        })
        .catch(err => {
          this.isUpdatingAssets = false;
          this.isUpdateAssetsResult = 'failed';
        });
    },
    async restore() {
      Object.assign(this.$state, getInitState());
      Ext.message.post(globalx.port!, {
        identify: ExtMessagesIdentities.Restore,
      });
    },
    testAssetServer() {
      return executeAtLeast<TestConnectivityResult>(
        Ext.message.post$(globalx.port!, {
          identify: ExtMessagesIdentities.TestAssetServer,
        }),
        1000
      ).then(res => {
        this.testConnectivityResult = res;
        return res;
      });
    },
  },
});
