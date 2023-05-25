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
import {onMounted} from "vue";
import {BuiltInExtMessageIdentities, Ext, ExtMessageDirections} from "@poe-vela/core";
import usePoeVelaL10n from "../../classifed/use-poe-vela-l10n";
import {AppEnv} from "../../app-env";
import MainPanel from "../../compoments/pupup/main-panel.vue";
import DevTools from "../../compoments/pupup/dev-tools.vue";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";

const poeVelaL10n = usePoeVelaL10n();

onMounted(() => {
  Ext.send.message({identify: ExtMessagesIdentities.GetPreference, direction: ExtMessageDirections.Runtime})
  Ext.on.message(message => {
    console.log("popup on message", message);
    // switch (message.identify) {
    //   case BuiltInExtMessageIdentities.ContentScriptReadyResponse:
    //     poeVelaL10n.actions.initial(message.payload)
    //     break;
    //   case ExtMessagesIdentities.OnPreferenceChanged:
    //     poeVelaL10n.actions.updatePreference(message.payload)
    //     break;
    // }

    return undefined;
  })
  Ext.on.response(message => {
    console.log("popup on response", message);
    switch (message.identify) {
      case ExtMessagesIdentities.GetPreference:
        poeVelaL10n.actions.updatePreference(message.payload)
        break;
    }
    return Promise.resolve();
  })
})

</script>
