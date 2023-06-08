<template>
  <div class="flex flex-col">
    <el-text class="self-center">
      POE Vela L10N
    </el-text>

    <el-alert v-if="hasChanged" class="mt-2" type="info" show-icon :closable="false">
      <p>检测到配置项改变, 刷新页面后生效</p>
    </el-alert>

    <el-form size="small" class="mt-2">
      <el-form-item label="语言">
        <el-select
          :model-value="poeVelaL10n.preference.language"
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
          :model-value="poeVelaL10n.preference.enableTranslation"
          @change="handleEnableTranslationChange"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="操作">
        <el-button-group>
          <el-button @click="handleAssetUpdate" :disabled="poeVelaL10n.isUpdatingAssets">
            <mutable-icon :state="buttonState"/>
            <span class="pl-1">更新资产</span>
          </el-button>
          <el-button @click="handleRestore">重置</el-button>
          <el-button @click="openOptions">高级设置</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

  </div>
</template>
<script setup lang="ts">
import {LanguageIdentities} from "@poe-vela/core/l10n";
import {Ext} from "@poe-vela/core/browser"
import {PreferenceEntity} from "@poe-vela/l10n-ext";
import usePoeVelaL10nPopup from "@/classifed/use-poe-vela-l10n.popup";
import {computed, ref, watch} from "vue";
import MutableIcon from "@/components/mutable-icon.vue";

const hasChanged = ref(false);

const poeVelaL10n = usePoeVelaL10nPopup()

const handleEnableTranslationChange = () => {
  poeVelaL10n.updatePreference({
    enableTranslation: !poeVelaL10n.preference.enableTranslation,
  })
}

const handleLanguageChange = (language: LanguageIdentities) => {
  poeVelaL10n.updatePreference({language: language} as Partial<PreferenceEntity>)
}

const handleAssetUpdate = () => {
  poeVelaL10n.updateAssets()
}

const handleRestore = () => {
  poeVelaL10n.restore()
}

const openOptions = () => {
  Ext.tabs.create({'url': 'chrome://extensions/?options=' + Ext.get.runtime.id})
}

const buttonState = computed(() => {
  if (poeVelaL10n.isUpdatingAssets) {
    return 0;
  }
  if (poeVelaL10n.isUpdateAssetsResult !== "none") {
    return poeVelaL10n.isUpdateAssetsResult === "successful" ? 1 : 2;
  }
})

/**
 * 用来判断是否初始化完成, 如果初始化完成, 则判断配置项是否有改变
 */
const isInitial = ref(false)

watch(() => poeVelaL10n.preference, () => {
  if (isInitial.value) {
    hasChanged.value = true;
  }
}, {deep: true})

watch(() => poeVelaL10n.isInitial, (newValue, oldValue) => {
  if (!oldValue && newValue) {
    isInitial.value = true
  }
})

</script>
