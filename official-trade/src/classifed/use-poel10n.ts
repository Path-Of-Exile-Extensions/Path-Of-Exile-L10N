import { reactive, toRefs } from 'vue'
import { CharacterService, DB, PreferenceEntity, PreferenceEntityDefault, PreferenceService, TranslationService } from '@poel10n/extra';

export type POEL10NViewState = {
  // 是否在初始化用户偏好中
  isInitingUserPreference: boolean,
  // 是否在初始化本地资产
  isInitingLocalAssets: boolean,
  // 是否需要更新资产
  needUpdateAssets: boolean,
  // 是否正在更新资产
  isUpdatingAssets: boolean,
  // 用户偏好
  preference: PreferenceEntity
}

const state = reactive<POEL10NViewState>({
  isInitingUserPreference: false,
  isInitingLocalAssets: false,
  hasLocalAssets: false,
  needUpdateAssets: false,
  isUpdatingAssets: false,
  preference: PreferenceEntityDefault
})

const actions = {
  // 初始化 db 驱动
  async initDBDrive() {
    await DB.Instance.initialize();
  },

  // 初始化用户偏好
  async initUserPreference() {
    state.isInitingUserPreference = true;
    await PreferenceService.Instance.initialize();
    state.preference = PreferenceService.Instance.preference;
    return Promise.resolve();
  },

  // 初始化资产
  async initCharacterService() {
    state.isInitingLocalAssets = true;
    const assets = await CharacterService.Instance.initialize();
    state.isInitingLocalAssets = false;
  },

  // 获得字符串对象
  async findATranslation(usString: string) {
    return TranslationService.Instance.translate(usString);
  },

}

export default () => {
  return {
    state,
    actions,
  };
}
