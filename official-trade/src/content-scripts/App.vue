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
import {CharacterService, ChromeCommunicationAction, DB, JustLogger, PreferenceService} from "@poel10n/extra";
import {onMounted} from "vue";
import {useElementVirtualRef} from "../classifed/use-element-virtual-ref";
import usePoel10n from "../classifed/use-poel10n";

const poel10n = usePoel10n();

const elementVirtualRef = useElementVirtualRef();

const patch = () => {
  const tradeEl = document.querySelector("#trade")!
  const navigationEl = tradeEl.querySelector(".navigation")!
  const searchAdvanced = tradeEl.querySelector(".search-bar.search-advanced")!
  const allTitles: HTMLElement[] = Array.from(searchAdvanced.querySelectorAll(".filter-title"))
  allTitles.forEach(el => {
    const us = el.innerText.trim()
    const character = CharacterService.Instance.findATranslation(us)
    if (character) {
      el.dataset["poel10n"] = character.c
      elementVirtualRef.observer(el)
    } else {

    }
  })
}

const test = () => {
  const tradeEl = document.querySelector("#trade")!
  const navigationEl = tradeEl.querySelector(".navigation")!
  const searchAdvanced = tradeEl.querySelector(".search-bar.search-advanced")!

  console.log("asasdasd")
  fetch(`https://raw.githubusercontent.com/Path-Of-Exile-Extensions/Path-Of-Exile-Official-Trade-Assets/master/test.json`)
    .then(res => res.json())
    .then(res => {
      const tradeEl = document.querySelector("#trade")!
      const assets: Record<string, any> = res;

      Object.entries(assets)
        .forEach(([id, asset]) => {
          if (tradeEl.querySelector(asset.elCSSSelector)) {
            tradeEl.querySelector(asset.elCSSSelector).textContent = asset.localizedLiteral;
          }
        })
    })
}

onMounted(async () => {
  await poel10n.actions.initDBDrive();
  await poel10n.actions.initUserPreference();
  await poel10n.actions.initCharacterService();
  patch()
  chrome.runtime.onMessage.addListener((action: ChromeCommunicationAction.Actions) => {
    JustLogger.Instance.info("onMessage", action)
    switch (action.TAG) {
      case "UpdateAssets":
        CharacterService.Instance.updateAssets()
        break;
      case "ClearCaches":
        DB.Instance.remove();
        break;
    }
    return true;
  });
})
</script>
<style scoped>

</style>
