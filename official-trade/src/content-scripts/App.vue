<template>
  <div class="container">

  </div>
</template>
<script setup lang="ts">
import {CharacterService, ChromeCommunicationAction, JustLogger, PreferenceService} from "@poel10n/extra";
import {onMounted} from "vue";

onMounted(async () => {
  await PreferenceService.Instance.initialize()
  await CharacterService.Instance.initialize()
  chrome.runtime.onMessage.addListener((action: ChromeCommunicationAction.Actions) => {
    JustLogger.Instance.info("onMessage", action)
    switch (action.TAG) {
      case "UpdateAssets":
        CharacterService.Instance.updateAssets()
        break;
      case "ClearCaches":
        CharacterService.Instance.clearCaches()
        break;
    }
    return true;
  });
})
</script>
<style scoped>

</style>
