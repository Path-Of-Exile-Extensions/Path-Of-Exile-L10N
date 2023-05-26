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
import {onMounted, shallowRef, watch} from "vue";
import {
  AssetVendor,
  AssetVendorMinimizeModel,
  delay,
} from "@poe-vela/core";
import {
  Ext,
  ExtMessageDirections,
  BuiltInExtMessageIdentities,
  TradeController,
  MenuType,
} from "@poe-vela/core/ext";
import {useDebounceFn} from "@vueuse/core";
import usePoeVelaL10n from "@/classifed/use-poe-vela-l10n";
import {useElementVirtualRef} from "@/classifed/use-element-virtual-ref";

const poeVelaL10n = usePoeVelaL10n();

const elementVirtualRef = useElementVirtualRef();

const tradeController = new TradeController()

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

const exchange = () => {
  fetch(`https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/master/full.json`)
    .then(res => res.json())
    .then(res => {
      tradeEl = document.querySelector("#trade")!
      const el = tradeEl.querySelector(".search-bar.search-advanced");
      const optionsELs = el.querySelector(".filter .filter-options")
      Array.from(optionsELs.childNodes)
        .forEach((optionsEL: HTMLDivElement) => {
          const oldTitle = optionsEL.title
          optionsEL.title = res[oldTitle] || `No Title (${optionsEL.title})`
        })

    })
}

const search = () => {
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

const test = () => {
  switch (tradeController.menuType) {
    case MenuType.Search:
      search()
      break;
    case MenuType.Exchange:
      exchange();
      break;
  }
}

onMounted(async () => {
  await tradeController.initialize()
  setTimeout(() => {
    exchange();
  }, 5000)
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
  Ext.on.message(message => {
    console.log("content script 收到消息", message)
  })

  Ext.send.message({
    identify: BuiltInExtMessageIdentities.ContentScriptReady,
    direction: ExtMessageDirections.Runtime,
    resDirection: ExtMessageDirections.Tab,
  })
})

watch(() => poeVelaL10n.state.preference, (state) => {
  state.enableTranslation && test()
})

</script>
<style scoped>

</style>
