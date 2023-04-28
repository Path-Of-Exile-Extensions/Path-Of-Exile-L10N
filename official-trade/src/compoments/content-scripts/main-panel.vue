<template>
  <div class="flex flex-col">
    <el-button-group>
      <el-button>简体中文 / Simplified Chinese</el-button>
      <el-button>繁体中文 / Traditional Chinese</el-button>
      <el-button>英文 / English</el-button>
    </el-button-group>
    <el-button class="mt-[6px]">更新语言包</el-button>
    <div class="flex flex-col items-center mt-[6px]">
      <el-button
        type="text"
        tag="a"
        href="https://github.com/Path-Of-Exile-Extensions/Path-Of-Exile-L10N/discussions"
        target="_blank"
        rel="noopener noreferrer"
        class="py-0 h-auto"
      >
        改善翻译
      </el-button>
      <el-button
        type="text"
        tag="a"
        href="https://github.com/Path-Of-Exile-Extensions/Path-Of-Exile-L10N/discussions"
        target="_blank"
        rel="noopener noreferrer"
        class="py-0 h-auto"
      >
        Other language support
      </el-button>
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
      <p>Powered By: Vue</p>
      <p>License GPL3</p>
    </div>
  </div>
</template>
