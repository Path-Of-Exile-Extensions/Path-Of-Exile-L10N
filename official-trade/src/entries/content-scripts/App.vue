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
import {onMounted, watch} from "vue";
import {AssetRecord, AssetVendorMinimizeModel} from "@poe-vela/core/l10n";
import {MenuType, TradeController} from "@poe-vela/core/browser";
import {useElementVirtualRef} from "@/classifed/use-element-virtual-ref";
import usePoeVelaL10nContentScript from "@/classifed/use-poe-vela-l10n.content-script";
import {Search} from "@/classifed/dom-observer";
import {PalmCivetModel} from "@/domain/palm-civet";

const poeVelaL10n = usePoeVelaL10nContentScript();

const elementVirtualRef = useElementVirtualRef();

const tradeController = new TradeController()

let tradeEl: Element | null = null;
let freezed = false;
let assets: AssetRecord = {}

const main = () => {
  // const t0 = window.performance.now();
  Object.entries(assets)
    .forEach(([_, asset]) => {
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
  // const t1 = window.performance.now();
  // console.log("doSomething 函数执行了" + (t1 - t0) + "毫秒。")
}

const search = () => {
  tradeEl = document.querySelector("#trade")!
  assets = AssetVendorMinimizeModel.decode(poeVelaL10n.state.palmCivet!.menuSearch);
  const el = tradeEl.querySelector(".search-bar.search-advanced");
  const observer = new MutationObserver(
    () => {
      // console.log("回调 MutationObserver")
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
}

onMounted(async () => {
  await tradeController.initialize();
})

watch([() => poeVelaL10n.state.preference.enableTranslation, () => poeVelaL10n.state.palmCivet], ([enableTranslation, palmCivet]: [boolean, PalmCivetModel]) => {
  if (enableTranslation && palmCivet && tradeController.menuType === MenuType.Search) {
    search()
    Search.Results.observer()
  }
})


</script>
<style scoped>

</style>
