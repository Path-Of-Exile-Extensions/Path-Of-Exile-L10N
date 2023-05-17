<template>
  <div class="flex flex-col">
    <el-form size="small">
      <el-form-item label="语言">
        <el-select v-model="form.language" placeholder="Select" class="w-full">
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
      <el-form-item label="操作">
        <el-button-group>
          <el-button @click="handleTranslate">应用</el-button>
          <el-button>更新资产</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item label="Join US">
        <el-button-group>
          <el-button
            tag="a"
            href="https://github.com/Path-Of-Exile-Extensions/Path-Of-Exile-L10N/discussions"
            target="_blank"
            rel="noopener noreferrer"
          >
            改善翻译
          </el-button>
          <el-button
            tag="a"
            href="https://github.com/Path-Of-Exile-Extensions/Path-Of-Exile-L10N/discussions"
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
          href="https://github.com/Path-Of-Exile-Extensions/Path-Of-Exile-L10N/"
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
import {Ext, ExtMessageDirections, LanguageIdentities} from "@poel10n/core";
import {ExtMessagesIdentities} from "../../classifed/ext-messages";
import {reactive} from "vue";
const form = reactive({
  language: LanguageIdentities["zh-Hans"],
})

const handleTranslate = () => {
  Ext.send.message(
    {identify: ExtMessagesIdentities.Translate},
    ExtMessageDirections.Tab,
  );
}

</script>
