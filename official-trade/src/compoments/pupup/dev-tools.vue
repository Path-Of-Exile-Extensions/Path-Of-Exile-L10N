<template>
  <el-button-group>
    <el-button :loading="buttonLoadingStates.updateAssets" @click="handleEvent(ExtMessagesIdentities.UpdateAssets)">更新资产</el-button>
    <el-button :loading="buttonLoadingStates.clearAssets" @click="handleEvent(ExtMessagesIdentities.ClearAssets)">清除资产</el-button>
    <el-button :loading="buttonLoadingStates.reload" @click="handleEvent(ExtMessagesIdentities.Reload)">重载</el-button>
  </el-button-group>
</template>
<script setup lang="ts">
import {ExtMessagesIdentities} from "../../classifed/ext-messages";
import {BuiltInExtMessageIdentities, Ext, ExtMessageDirections} from "@poe-vela/core";
import {onMounted, reactive} from "vue";

const buttonLoadingStates = reactive({
  updateAssets: false,
  clearAssets: false,
  reload: false,
});

onMounted(() => {
  Ext.on.message((message) => {
    if (message.identify === BuiltInExtMessageIdentities.ContentScriptReady) {
      buttonLoadingStates.clearAssets = false;
      buttonLoadingStates.clearAssets = false;
      buttonLoadingStates.reload = false;
    }
  });
})

const handleEvent = (messageId: ExtMessagesIdentities) => {
  switch (messageId) {
    case ExtMessagesIdentities.UpdateAssets:
      Ext.send.message(
        {identify: messageId},
        ExtMessageDirections.Tab,
      );
      break;
    case ExtMessagesIdentities.ClearAssets:
      Ext.send.message(
        {identify: messageId},
        ExtMessageDirections.Tab,
      );
      break;
    case ExtMessagesIdentities.Reload:
      Ext.send.message(
        {identify: messageId},
        ExtMessageDirections.Runtime,
      );
      Ext.reload.tabs();
      break;
  }
}

</script>
