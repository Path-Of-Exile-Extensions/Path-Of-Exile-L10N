<template>
  <el-config-provider>
    <div class="flex flex-col px-[10px] py-[15px] w-[300px]">
      <main-panel/>
      <el-button-group>
        <el-button @click="handleToContentScript('update')">更新资产</el-button>
        <el-button @click="handleToContentScript('clear')">清除资产</el-button>
      </el-button-group>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import "./styles/popup.css"
import MainPanel from "./compoments/pupup/main-panel.vue";
import {ChromeCommunicationAction} from "@poel10n/extra";

const handleToContentScript = (type: "update" | "clear") => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const tab = tabs[0];
    if (tab) {
      const id = tab!.id!

      switch (type) {
        case "update":
          chrome.tabs.sendMessage(id, new ChromeCommunicationAction.UpdateAssets());
          break;
        case "clear":
          chrome.tabs.sendMessage(id, new ChromeCommunicationAction.ClearCaches());
          break;
      }
    }
  });
  return true;
}

</script>
