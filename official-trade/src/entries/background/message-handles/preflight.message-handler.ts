import {ExtMessage} from "@poe-vela/core/browser";
import {MessageHandlerBase} from "./message-handler.base";
import {Stat, TradeFetchTypes} from "@poe-vela/core/l10n";
import {cloneDeep} from "lodash-es";
import {PalmCivetService} from "@/domain/palm-civet";

export class PreflightMessageHandler extends MessageHandlerBase {
  handle(message: ExtMessage<TradeFetchTypes.Result[]>, statsFlat: Map<string, string>) {
    return message.payload = message.payload!.map((i: TradeFetchTypes.Result) => {
      const output = cloneDeep(i);
      if (i.item) {
        // 本地化需求数据
        if (i.item.requirements) {
          this.__requirements(output.item.requirements!)
        }

        // 本地化属性
        if (i.item.properties) {
          this.__properties(output.item.properties!)
        }

        // 本地化技能宝石
        if (i.item.explicitMods && !i.item.extended.mods) {
          /**
           * 如果是瓦尔技能宝石
           * typeLine 为瓦尔技能名称, 原始技能名称为 hybrid.baseTypeName
           * secDescrText 始终为原始技能描述, hybrid.secDescrText 始终为瓦尔技能描述
           * explicitMods 始终为原始技能 Mod, hybrid.explicitMods 始终为瓦尔技能 Mod
           * properties 始终为原始技能 properties, hybrid.properties 始终为瓦尔技能 properties
           */
          const isVaal = i.item.hybrid?.isVaalGem;
          // 由上面决定是否为瓦尔宝石
          const gem = PalmCivetService.Instance.palmCivet.gemFlat.get(i.item.typeLine)

          if (gem) {
            // 技能宝石名称
            // 如果是宝石, 尝试重新本地化名称, 进入这个 if 表示之前的本地化没有生效
            if (i.item.typeLine === output.item.typeLine) {
              output.item.typeLine = gem.name
            }

            // 技能宝石描述
            output.item.secDescrText = gem.secDescrText

            const statsWithLang = PalmCivetService.Instance.palmCivet.gemStatsFlat.get(gem.name_)!
            // 如果只有 explicitMods, 但是没有 extended, 说明可能是技能宝石, 这时候要模糊搜索
            output.item.explicitMods.forEach((statWithContent, index) => {
              const gemStat = Stat.matching(statWithContent, statsWithLang);
              if (gemStat) {
                output.item.explicitMods[index] = Stat.replace(statWithContent, gemStat.name, gemStat.name_)
              }
            })

            if (i.item.hybrid) {
              const vaalGem = PalmCivetService.Instance.palmCivet.gemFlat.get(i.item.hybrid.baseTypeName)

              if (vaalGem) {
                output.item.hybrid!.baseTypeName = vaalGem.name
                output.item.hybrid!.secDescrText = vaalGem.secDescrText
                const vaalStatsWithLang = PalmCivetService.Instance.palmCivet.gemStatsFlat.get(vaalGem.name_)!

                if (i.item.hybrid.properties) {
                  this.__properties(output.item.hybrid!.properties!)
                }
                if (i.item.hybrid.explicitMods) {
                  i.item.hybrid.explicitMods.forEach((statWithContent, index) => {
                    const gemStat = Stat.matching(statWithContent, vaalStatsWithLang);
                    if (gemStat) {
                      output.item.hybrid!.explicitMods![index] = Stat.replace(statWithContent, gemStat.name, gemStat.name_)
                    }
                  })
                }
              }
            }

            return output;
          }
        }

        // 本地化名称
        if (i.item.name) {
          output.item.name = PalmCivetService.Instance.palmCivet.full.get(i.item.name) || i.item.name
        }

        // 本地化基础类型
        if (i.item.typeLine) {
          output.item.typeLine = PalmCivetService.Instance.palmCivet.full.get(i.item.typeLine) || i.item.typeLine
        }

        // 本地化物品隐式属性(除去技能宝石)
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

            const statWithLang = PalmCivetService.Instance.palmCivet.statsIdFlat.get(hash);
            const stat = statsFlat.get(hash)!;
            output.item.explicitMods[index] = Stat.replace(explicitMod, statWithLang!, stat)
          }

          return output;
        }

        // 本地化物品显示属性(除去技能宝石)
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
            const statWithLang = PalmCivetService.Instance.palmCivet.statsIdFlat.get(hash);
            const stat = statsFlat.get(hash)!;
            output.item.implicitMods![index] = Stat.replace(implicitMod, statWithLang!, stat)
          }
        }

      }

      return output;
    })
  }


  __properties(properties: TradeFetchTypes.Property[]) {
    return properties!.forEach(property => {
      const nameArray = property.name!.split(",")
      if (nameArray.length > 1) {
        property.name = nameArray.map(i => {
          i = i.trim();
          return PalmCivetService.Instance.palmCivet.common.get(i) || i
        }).join(", ")
      } else {
        if (property.name) {
          property.name = PalmCivetService.Instance.palmCivet.common.get(property.name) || property.name
        }
      }
    })
  }

  __requirements(requirements: TradeFetchTypes.Requirement[]) {
    return requirements!.forEach(requireItem => {
      if (requireItem.name) {
        requireItem.name = PalmCivetService.Instance.palmCivet.common.get(requireItem.name) || requireItem.name
      }
    })
  }
}
