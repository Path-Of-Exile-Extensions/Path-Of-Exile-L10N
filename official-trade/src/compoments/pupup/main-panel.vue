<template>
  <div class="flex flex-col">
    <el-form size="small">
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
      <el-form-item label="自动翻译">
        <el-button-group>
          <el-switch
            :model-value="poeVelaL10n.state.preference.enableTranslation"
            @change="handleEnableTranslationChange"
          >
          </el-switch>
        </el-button-group>
      </el-form-item>
    </el-form>

  </div>
</template>
<script setup lang="ts">
import {LanguageIdentities} from "@poe-vela/core";
import usePOEVelaL10n from "@/classifed/use-poe-vela-l10n";
import {PreferenceEntity} from "@poe-vela/l10n-ext";

const poeVelaL10n = usePOEVelaL10n()

const handleEnableTranslationChange = () => {
  poeVelaL10n.actions.updatePreference({
    enableTranslation: !poeVelaL10n.state.preference.enableTranslation,
  })
}

const handleLanguageChange = (language: LanguageIdentities) => {
  poeVelaL10n.actions.updatePreference({language: language} as Partial<PreferenceEntity>)
}

</script>
