<template>
  <div class="flex flex-col px-[10px] py-[15px] w-[300px]">
    <main-panel/>
  </div>
</template>

<script setup lang="ts">
import MainPanel from "@/components/pupup/main-panel.vue";
import usePoeVelaL10nPopup from "@/classifed/use-poe-vela-l10n.popup";
import {onMounted} from "vue";
import {Ext} from "@poe-vela/core/browser";
import {globalx} from "@/classifed/globalx";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
const poeVelaL10N = usePoeVelaL10nPopup();

onMounted(async () => {
  Ext.message
    .post$(globalx.port!, {identify: ExtMessagesIdentities.Initialize})
    .then(res => {
      poeVelaL10N.initial(res)
    })

  Ext.message.addListener.message(
    globalx.port!,
    message => {
      switch (message.identify) {
        case ExtMessagesIdentities.ReInitialize:
          poeVelaL10N.initial(message.payload)
          break;
        case ExtMessagesIdentities["Preference:Changed"]:
          poeVelaL10N.preference = message.payload;
          break;
      }
    }
  )
})
</script>
