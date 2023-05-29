<template>
  <div class="flex flex-col">
    <el-alert v-if="hasChanged" type="info" show-icon :closable="false">
      <p>检测到配置项改变, 刷新页面后生效</p>
    </el-alert>
    <el-form size="small" class="mt-2">
      <el-form-item label="语言">
        <el-select
          :model-value="poeVelaL10n.state.preference.language"
          placeholder="Select"
          class="w-full"
          @change="handleLanguageChange"
        >
          <el-option
            label="简体中文 / Simplified Chinese"
            :value="LanguageIdentities['zh-Hans']"
          />
          <el-option
            label="繁体中文 / Traditional Chinese"
            :value="LanguageIdentities['zh-Hant']"
          />
          <el-option
            label="英文 / English"
            :value="LanguageIdentities['en']"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="启用">
        <el-switch
          :model-value="poeVelaL10n.state.preference.enableTranslation"
          @change="handleEnableTranslationChange"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="操作">
        <el-button-group>
          <el-button @click="handleAssetUpdate" :disabled="poeVelaL10n.state.isUpdatingAssets">
            <mutable-icon :state="buttonState"/>
            <span class="pl-1">更新资产</span>
          </el-button>
          <el-button @click="handleRestore">还原</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

  </div>
</template>
<script setup lang="ts">
import {LanguageIdentities} from "@poe-vela/core";
import {PreferenceEntity} from "@poe-vela/l10n-ext";
import usePoeVelaL10nPopup from "@/classifed/use-poe-vela-l10n.popup";
import {computed, ref} from "vue";
import MutableIcon from "@/compoments/mutable-icon.vue";

const hasChanged = ref(false);

const poeVelaL10n = usePoeVelaL10nPopup()

const handleEnableTranslationChange = () => {
  poeVelaL10n.actions.updatePreference({
    enableTranslation: !poeVelaL10n.state.preference.enableTranslation,
  })
  hasChanged.value = true;
}

const handleLanguageChange = (language: LanguageIdentities) => {
  poeVelaL10n.actions.updatePreference({language: language} as Partial<PreferenceEntity>)
  hasChanged.value = true;
}

const handleAssetUpdate = () => {
  poeVelaL10n.actions.updateAssets()
  hasChanged.value = true;
}

const handleRestore = () => {
  poeVelaL10n.actions.restore()
  hasChanged.value = true;
}

const buttonState = computed(() => {
  if (poeVelaL10n.state.isUpdatingAssets) {
    return 0;
  }
  if (poeVelaL10n.state.isUpdateAssetsResult !== "none") {
    return poeVelaL10n.state.isUpdateAssetsResult === "success" ? 1 : 2;
  }
})

</script>
