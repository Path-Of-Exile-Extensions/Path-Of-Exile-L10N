<template>
  <el-tooltip
    v-model:visible="elementVirtualRef.visible"
    :content="elementVirtualRef.vnode"
    effect="dark"
    virtual-triggering
    :virtual-ref="elementVirtualRef.triggerRef"
  />
</template>
<script setup lang="ts">
import {CharacterService, ChromeCommunicationAction, JustLogger, PreferenceService} from "@poel10n/extra";
import {onMounted} from "vue";
import {useElementVirtualRef} from "../classifed/use-element-virtual-ref";

const elementVirtualRef = useElementVirtualRef();

const patch = () => {
  const tradeEl = document.querySelector("#trade")!
  const navigationEl = tradeEl.querySelector(".navigation")!
  const searchAdvanced = tradeEl.querySelector(".search-bar.search-advanced")!
  const allTitles: HTMLElement[] = Array.from(searchAdvanced.querySelectorAll(".filter-title"))
  allTitles.forEach(el => {
    const us = el.innerText.trim()
    const t = CharacterService.Instance.findATranslation(us)
    if (t) {
      el.dataset["poel10n"] = t
      elementVirtualRef.observer(el)
    } else {

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
