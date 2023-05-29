<template>
  <div class="flex flex-col px-[10px] py-[15px] w-[300px]">
    <main-panel/>
  </div>
</template>

<script setup lang="ts">
import MainPanel from "../../compoments/pupup/main-panel.vue";
import usePoeVelaL10nPopup from "@/classifed/use-poe-vela-l10n.popup";
usePoeVelaL10nPopup();
</script>
