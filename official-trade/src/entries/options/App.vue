<template>
  <main>
    <el-form>
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
  </main>
</template>

<script setup lang="ts">

</script>

<style>
main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
