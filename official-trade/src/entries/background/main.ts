import {Ext, PortStore} from "@poe-vela/core/browser";
import {clone, cloneDeep} from "lodash-es";
import initialize from "./initialize";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {PreferenceService} from "@poe-vela/l10n-ext";
import {PalmCivetService} from "@/domain/palm-civet";
import {Stat, TradeFetchTypes} from "@poe-vela/core/l10n";

const getViewData = () => {
  return {
    preference: PreferenceService.Instance.preference,
  }
}

let statsFlat = new Map<string, string>();

fetch("https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/master/stats.flat.min.primitive-language.json")
  .then(res => res.json())
  .then(res => {
    statsFlat = new Map(Object.entries(res));
  })

const portStore = new PortStore();

Ext.message.onConnect(port => {
  portStore.add(port);
  port.onDisconnect.addListener(() => {
    portStore.remove(port);
  })

  console.log("background.ts", "onConnect", port)
  Ext.message.addListener.message(port, async (message) => {
    console.log("background.ts", "message 接受消息", message)
    await initialize();
    switch (message.identify) {
      case ExtMessagesIdentities["Preference:Update"]:
        const old = clone(PreferenceService.Instance.preference);
        await PreferenceService.Instance.upsert(message.payload);
        Ext.message.post(
          port,
          {
            identify: ExtMessagesIdentities["Preference:Changed"],
            payload: message.payload,
          }
        )
        // 如果之前没有启用翻译, 现在启用了, 则需要更新资产文件
        if (!old.enableTranslation && PreferenceService.Instance.preference.enableTranslation) {
          await PalmCivetService.Instance.forceUpdate();
          Ext.message.multicast(
            portStore.values(),
            {
              identify: ExtMessagesIdentities["PalmCivet:Updated"],
              payload: PalmCivetService.Instance.palmCivet,
            }
          )
        }
        break;
      case ExtMessagesIdentities["PalmCivet:Update"]:
        await PalmCivetService.Instance.forceUpdate();
        Ext.message.multicast(
          portStore.values(),
          {
            identify: ExtMessagesIdentities["PalmCivet:Updated"],
            payload: PalmCivetService.Instance.palmCivet,
          }
        )
        break;
      case ExtMessagesIdentities.Restore:
        await PreferenceService.Instance.deleteAll();
        await PalmCivetService.Instance.deleteAll();
        break;
      case ExtMessagesIdentities.Reload:
        chrome.runtime.reload()
    }

    return undefined;
  })

  Ext.message.addListener.message$(port, async (message) => {
    console.log("background.ts", "message$ 接受消息", message)
    await initialize();
    switch (message.identify) {
      case ExtMessagesIdentities["PalmCivet:Get"]:
        return await PalmCivetService.Instance.get();
      case ExtMessagesIdentities.Initialize:
        return getViewData();
      case ExtMessagesIdentities["Preflight"]:
        message.payload = message.payload.map((i: TradeFetchTypes.Result) => {
          const output = cloneDeep(i);
          if (i.item) {
            // 本地化名称
            if (i.item.name) {
              output.item.name = PalmCivetService.Instance.palmCivet.full.get(i.item.name) || i.item.name
            }

            // 本地化基础类型
            if (i.item.typeLine) {
              output.item.typeLine = PalmCivetService.Instance.palmCivet.full.get(i.item.typeLine) || i.item.typeLine
            }

            // 本地化隐式属性
            if (
              i.item.explicitMods
              && i.item.extended
              && i.item.extended.mods
              && i.item.extended.mods.explicit
              && i.item.extended.hashes
              && i.item.extended.hashes.explicit
            ) {
              for (const [index, explicitMod] of i.item.explicitMods.entries()) {
                // 这个 hash 就是完整的 stat id
                const [hash,] = i.item.extended.hashes.explicit[index]
                // stat 的最大最小
                // const mod = i.item.extended
                //   .mods
                //   .explicit
                //   .find(i => {
                //     return i.magnitudes.some(i => i.hash === hash)
                //   })

                const statWithLang = PalmCivetService.Instance.palmCivet.statsFlat.get(hash);
                const stat = statsFlat.get(hash)!;
                output.item.explicitMods[index] = Stat.replace(explicitMod, statWithLang!, stat)
              }
            } else if (i.item.explicitMods && !i.item.extended.mods) {
              if (i.item.typeLine) {
                const gem = PalmCivetService.Instance.palmCivet.gemFlat.get(i.item.typeLine)
                if (gem) {
                  // 技能宝石名称
                  output.item.typeLine = gem.name
                  // 技能宝石描述
                  output.item.secDescrText = gem.secDescrText

                  const statsWithLang = PalmCivetService.Instance.palmCivet.gemStatsFlat.get(gem.name_)!
                  // 如果只有 explicitMods, 但是没有 extended, 说明可能是技能宝石, 这时候要模糊搜索
                  output.item.explicitMods.forEach((mod, index) => {
                    output.item.explicitMods[index] = Stat.replaceFuzzy(mod, statsWithLang[index])
                  })
                }
              }

            }

            // 本地化显示属性
            if (
              i.item.implicitMods
              && i.item.extended
              && i.item.extended.mods
              && i.item.extended.mods.implicit
              && i.item.extended.hashes
              && i.item.extended.hashes.implicit
            ) {
              for (const [index, implicitMod] of i.item.implicitMods.entries()) {
                // 这个 hash 就是完整的 stat id
                const [hash,] = i.item.extended.hashes.implicit[index]
                const statWithLang = PalmCivetService.Instance.palmCivet.statsFlat.get(hash);
                const stat = statsFlat.get(hash)!;
                output.item.implicitMods![index] = Stat.replace(implicitMod, statWithLang!, stat)
              }
            }

          }
          return output;
        })
        break;
    }

    return message.payload;
  })
})
