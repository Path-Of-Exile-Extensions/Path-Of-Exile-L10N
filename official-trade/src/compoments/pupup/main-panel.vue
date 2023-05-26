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
      <el-form-item label="Join US">
        <el-button-group>
          <el-button
            tag="a"
            href="https://github.com/Path-Of-Exile-Vela/L10N/discussions"
            target="_blank"
            rel="noopener noreferrer"
          >
            改善翻译
          </el-button>
          <el-button
            tag="a"
            href="https://github.com/Path-Of-Exile-Vela/L10N/discussions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Other language support
          </el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <div class="flex flex-col items-center">
      <div class="flex flex-row items-center">
        <span class="pr-2">Source Code At</span>
        <el-link
          type="primary"
          href="https://github.com/Path-Of-Exile-Vela/L10N"
          target="_blank"
          rel="noopener noreferrer"
          class="py-0 h-auto"
          title="Github Source"
        >
          Github
        </el-link>
      </div>
      <div class="flex flex-row items-center">
        <span class="pr-2">Created By</span>
        <el-link
          type="primary"
          href="https://www.pathofexile.com/account/view-profile/PleaseCallMeKiKi"
          target="_blank"
          rel="noopener noreferrer"
          class="py-0 h-auto"
          title="kiki"
        >
          KiKi
        </el-link>
      </div>
      <p>Powered By: Vue.js</p>
      <p>License GPL3</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import {LanguageIdentities} from "@poe-vela/core";
import {Ext, ExtMessageDirections} from "@poe-vela/core/ext";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {reactive} from "vue";
import usePOEVelaL10n from "@/classifed/use-poe-vela-l10n";

const poeVelaL10n = usePOEVelaL10n()

const form = reactive({
  language: LanguageIdentities["zh-Hans"],
})

const handleTranslate = () => {
  Ext.send.message(
    {identify: ExtMessagesIdentities.Translate, direction: ExtMessageDirections.Tab},
  );
}

const handleEnableTranslationChange = () => {
  poeVelaL10n.actions.updatePreference({
    enableTranslation: !poeVelaL10n.state.preference.enableTranslation,
  })
}

const handleLanguageChange = (language: LanguageIdentities) => {
  poeVelaL10n.actions.updatePreference({language: language})
}

</script>
