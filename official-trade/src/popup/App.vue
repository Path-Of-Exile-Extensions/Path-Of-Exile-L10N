<template>
  <el-config-provider>
    <div class="flex flex-col px-[10px] py-[15px] w-[300px]">
      <main-panel/>
      <dev-tools v-if="AppEnv.IsDev"/>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import "./styles/popup.css"
import MainPanel from "../compoments/pupup/main-panel.vue";
import DevTools from "../compoments/pupup/dev-tools.vue";
import {AppEnv} from "../app-env";
import {onMounted} from "vue";
import usePoeVelaL10n from "../classifed/use-poe-vela-l10n";
import {BuiltInExtMessageIdentities, Ext} from "@poe-vela/core";
import {ExtMessagesIdentities} from "../classifed/ext-messages";

const poeVelaL10n = usePoeVelaL10n();

onMounted(() => {
  Ext.on.message(message => {
    console.log("popup on message", message);
    switch (message.identify) {
      case BuiltInExtMessageIdentities.ContentScriptReadyResponse:
        poeVelaL10n.actions.initial(message.payload)
        break;
      case ExtMessagesIdentities.OnPreferenceChanged:
        poeVelaL10n.actions.updatePreference(message.payload)
        break;
    }
  })
})

</script>
