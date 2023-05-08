<template>
  <el-config-provider>
    <div class="flex flex-col px-[10px] py-[15px] w-[300px]">
      <main-panel/>
      <el-button-group>
        <el-button @click="handleToContentScript('update')">更新资产</el-button>
        <el-button @click="handleToContentScript('clear')">清除资产</el-button>
        <el-button @click="handleToContentScript('reload')">重载</el-button>
      </el-button-group>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import "./styles/popup.css"
import MainPanel from "./compoments/pupup/main-panel.vue";
import {ChromeCommunicationAction} from "@poel10n/extra";

const handleToContentScript = (type: "update" | "clear" | "reload") => {
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
        case "reload":
          chrome.runtime.sendMessage("reload");
          chrome.tabs.reload(tabs[0].id);
          break;
      }
    }
  });
  return true;
}

</script>
