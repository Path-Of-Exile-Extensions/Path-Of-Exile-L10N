<template>
  <div class="flex flex-col px-[10px] py-[15px] w-[300px]">
    <main-panel/>
    <dev-tools v-if="AppEnv.IsDev"/>
  </div>
</template>

<script setup lang="ts">
import {AppEnv} from "../../app-env";
import MainPanel from "../../compoments/pupup/main-panel.vue";
import DevTools from "../../compoments/pupup/dev-tools.vue";
</script>
