<template>
  <div class="flex flex-col">
    <el-form size="small">
      <el-form-item label="语言">
        <el-select placeholder="Select">
          <el-option
            label="简体中文 / Simplified Chinese"
            value="zh-hans"
          />
          <el-option
            label="繁体中文 / Traditional Chinese"
            value="zh-hant"
          />
          <el-option
            label="英文 / English"
            value="us"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作">
        <el-button-group>
          <el-button>更新资产</el-button>
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

    <div class="flex flex-col items-center mt-[6px]">
      <div class="flex flex-row items-center">
        <span>Source Code At</span>
        <el-button
          type="text"
          tag="a"
          href="https://github.com/Path-Of-Exile-Extensions/Path-Of-Exile-L10N/"
          target="_blank"
          rel="noopener noreferrer"
          class="py-0 h-auto"
        >
          Github
        </el-button>
      </div>
      <div class="flex flex-row items-center">
        <span>Created By</span>
        <el-button
          type="text"
          tag="a"
          href="https://www.pathofexile.com/account/view-profile/PleaseCallMeKiKi"
          target="_blank"
          rel="noopener noreferrer"
          class="py-0 h-auto"
        >
          KiKi
        </el-button>
      </div>
      <p>Powered By: Vue.js</p>
      <p>License GPL3</p>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
