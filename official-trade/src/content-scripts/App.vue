<template>
  <div class="container">

  </div>
</template>
<script setup lang="ts">
import {CharacterService, ChromeCommunicationAction, JustLogger, PreferenceService} from "@poel10n/extra";
import {onMounted} from "vue";

const patch = () => {
  const tradeEl = document.querySelector("#trade")
  const navigationEl = tradeEl.querySelector(".navigation")
  const searchAdvanced = tradeEl.querySelector(".search-bar.search-advanced")
  const allTitles: HTMLElement[] = [...searchAdvanced.querySelectorAll(".filter-title")]
  allTitles.forEach(el => {
    const us = el.innerText.trim()
    const t = CharacterService.Instance.findATranslation(us)
    if (t) {
      // 替换 el.innerText
      el.innerText = el.innerText.replace(us, t)
    }
  })
}

onMounted(async () => {
  await PreferenceService.Instance.initialize()
  await CharacterService.Instance.initialize()
  patch()
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
