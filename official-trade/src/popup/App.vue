<template>
  <el-config-provider>
    <div class="flex flex-col px-[10px] py-[15px] w-[300px]">
      <main-panel/>
      <dev-tools/>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import "./styles/popup.css"
import MainPanel from "../compoments/pupup/main-panel.vue";
import DevTools from "../compoments/pupup/dev-tools.vue";
</script>
