import {AssetChecksum, AssetVendorMinimize, LanguageIdentities, ServerResourceTypes} from "@poe-vela/core/l10n";
import {GemEntity, GemStatModel} from "@poe-vela/core";

export type PalmCivet = {
  checksums: string;
  common: string;
  items: string;
  itemsBoth: string;
  static: string;
  stats: string;
  lang: LanguageIdentities
  statsIdFlat: string;
  menuSearch: string;
  full: string;
  gemFlat: string;
  gemNames: string;
  gemStatsFlat: string;
};

export type PalmCivetModel = {
  checksums: AssetChecksum[]
  // 使用 map, 性能更好 https://gist.github.com/Chunlin-Li/2606bd813df88eaeee2d
  common: Map<string, string>
  static: ServerResourceTypes.Static.Statics[];
  stats: ServerResourceTypes.Stats.Stats[];
  items: ServerResourceTypes.Items.Items[];
  itemsBoth: ServerResourceTypes.Items.Items[];
  lang: LanguageIdentities;
  statsIdFlat: Map<string, string>
  menuSearch: Record<string, AssetVendorMinimize>,
  full: Map<string, string>,
  gemFlat: Map<string, GemEntity>,
  gemNames: Map<string, string>,
  gemStatsFlat: Map<string, GemStatModel[]>,
};

export namespace PalmCivetModel {
  export const empty = (): PalmCivetModel => {
    return {
      items: [],
      itemsBoth: [],
      static: [],
      stats: [],
      lang: LanguageIdentities["en"],
      checksums: [],
      common: new Map(),
      statsIdFlat: new Map(),
      menuSearch: {},
      full: new Map(),
      gemFlat: new Map(),
      gemNames: new Map(),
      gemStatsFlat: new Map(),
    }
  }

  export function substitutes(palmCivet: PalmCivetModel) {
    localStorage.setItem("lscache-tradedata", JSON.stringify(palmCivet.static))
    localStorage.setItem("lscache-tradeitems", JSON.stringify(palmCivet.items))
    localStorage.setItem("lscache-tradestats", JSON.stringify(palmCivet.stats))
  }

  export function restore() {
    localStorage.removeItem("lscache-tradedata")
    localStorage.removeItem("lscache-tradeitems")
    localStorage.removeItem("lscache-tradestats")
    localStorage.removeItem("lscache-tradedata-cacheexpiration")
    localStorage.removeItem("lscache-tradeitems-cacheexpiration")
    localStorage.removeItem("lscache-tradestats-cacheexpiration")
  }
}
