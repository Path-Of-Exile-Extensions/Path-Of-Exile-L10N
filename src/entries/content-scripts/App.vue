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
import {AssetVendor, AssetVendorMinimizeModel} from "@poe-vela/core/l10n";
import {Ext, TradeController} from "@poe-vela/core/browser";
import {useElementVirtualRef} from "@/classifed/use-element-virtual-ref";
import usePoeVelaL10nContentScript from "@/classifed/use-poe-vela-l10n.content-script";
import {PalmCivetModel} from "@/domain/palm-civet";
import {globalx} from "@/classifed/globalx";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {Notifications} from "@/classifed/notifications";

const poeVelaL10N = usePoeVelaL10nContentScript();

const elementVirtualRef = useElementVirtualRef();

const tradeController = new TradeController()

let tradeEl: Element | null = null;
let freezed = false;
let assets: Record<string, AssetVendor> = {}

const main = () => {
  // const t0 = window.performance.now();
  Object.keys(assets)
    .forEach((key) => {
      const asset = assets[key]
      const el = tradeEl!.querySelector(asset.elCSSSelector) as HTMLElement
      if (!el) {
        // throw new Error(`can not find element by selector: ${asset.elCSSSelector}`)
        return
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
  assets = AssetVendorMinimizeModel.decode(poeVelaL10N.palmCivet!.menuSearch);
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


onMounted(async () => {
  Ext.message.post$(globalx.port!, {identify: ExtMessagesIdentities.Initialize})
    .then(res => {
      poeVelaL10N.initial(res)
    })

  Ext.message.addListener.message(globalx.port!, message => {
    switch (message.identify) {
      case ExtMessagesIdentities.ReInitialize:
        poeVelaL10N.initial(message.payload)
        break;
      case ExtMessagesIdentities["Preference:Changed"]:
        poeVelaL10N.preference = message.payload;
        Notifications.PreferenceChanged();
        if (!poeVelaL10N.preference.enableTranslation) {
          poeVelaL10N.restore();
        }
        break;
      case ExtMessagesIdentities["PalmCivet:Updated"]:
        poeVelaL10N.palmCivet = message.payload;
        Notifications.PalmCivetChanged();
        break;
      case ExtMessagesIdentities.Restore:
        Notifications.PreferenceChanged();
        poeVelaL10N.restore();
        break;
    }
    return undefined;
  })
})

watch(poeVelaL10N.$state, () => {
  if (poeVelaL10N.preference.enableTranslation) {
    if (poeVelaL10N.palmCivet) {
      PalmCivetModel.substitutes(poeVelaL10N.palmCivet! as PalmCivetModel)
      search()
    } else {
      poeVelaL10N.GetPalmCivet();
    }
  } else {
    poeVelaL10N.restore();
  }
})

</script>
<style scoped>

</style>
