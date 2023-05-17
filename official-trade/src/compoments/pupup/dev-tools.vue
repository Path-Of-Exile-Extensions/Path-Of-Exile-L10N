<template>
  <el-button-group>
    <el-button @click="handleEvent(ExtMessagesIdentities.UpdateAssets)">更新资产</el-button>
    <el-button @click="handleEvent(ExtMessagesIdentities.ClearAssets)">清除资产</el-button>
    <el-button @click="handleEvent(ExtMessagesIdentities.Reload)">重载</el-button>
  </el-button-group>
</template>
<script setup lang="ts">
import {ExtMessagesIdentities} from "../../classifed/ext-messages";
import {Ext, ExtMessageDirections} from "@poel10n/core";

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
