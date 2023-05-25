<template>
  <el-tooltip
    v-model:visible="elementVirtualRef.visible"
    :content="elementVirtualRef.vnode"
    effect="dark"
    virtual-triggering
    :virtual-ref="elementVirtualRef.triggerRef as any"
  />
</template>
<script setup lang="ts">
import {CharacterService} from "@poe-vela/l10n-ext";
import {onMounted, shallowRef, watch} from "vue";
import {
  AssetVendor,
  AssetVendorMinimizeModel,
  BuiltInExtMessageIdentities,
  Ext,
  ExtMessageDirections
} from "@poe-vela/core";
import {useDebounceFn} from "@vueuse/core";
import usePoeVelaL10n from "@/classifed/use-poe-vela-l10n";
import {useElementVirtualRef} from "@/classifed/use-element-virtual-ref";

const poeVelaL10n = usePoeVelaL10n();

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

let tradeEl: Element | null = null;
const assets = shallowRef<Record<string, AssetVendor>>({})
let freezed = false;

const main = useDebounceFn(() => {
  Object.entries(assets.value)
    .forEach(([id, asset]) => {
      const el = tradeEl!.querySelector(asset.elCSSSelector) as HTMLElement
      if (!el) {
        throw new Error(`can not find element by selector: ${asset.elCSSSelector}`)
      }

      if (asset.corrupted) {
        el.innerHTML = el.innerHTML.replace(asset.literal, asset.localizedLiteral)
      } else {
        el.textContent = asset.localizedLiteral;
      }
    })
}, 50)

const test = () => {
  fetch(`https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/master/test.json`)
    .then(res => res.json())
    .then(res => {
      tradeEl = document.querySelector("#trade")!
      assets.value = AssetVendorMinimizeModel.decode(res);
      const el = tradeEl.querySelector(".search-bar.search-advanced");
      const observer = new MutationObserver(
        () => {
          console.log("回调 MutationObserver")
          if (freezed) {
            return
          }
          freezed = true;
          try {
            main()
          } catch (e) {

          }
          freezed = false;
        }
      )
      observer.observe(el!, {childList: true})

      main();
    })
}

onMounted(() => {
  console.log("走到这里")
  Ext.on.response(message => {
    console.log("content script 收到响应", message)
    switch (message.identify) {
      case BuiltInExtMessageIdentities.ContentScriptReady:
        poeVelaL10n.actions.initial(message.payload)
        break;
      // case ExtMessagesIdentities.OnPreferenceChanged:
      //   poeVelaL10n.actions.updatePreference(message.payload)
      //   break;
    }

    return Promise.resolve();
  })

  Ext.send.message({
    identify: BuiltInExtMessageIdentities.ContentScriptReady,
    direction: ExtMessageDirections.Runtime,
  })
})

watch(() => poeVelaL10n.state.preference, (state) => {
  state.enableTranslation && test()
})


</script>
<style scoped>

</style>
