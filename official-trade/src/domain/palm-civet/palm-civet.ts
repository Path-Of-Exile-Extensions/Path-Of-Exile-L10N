import {AssetChecksum, AssetRecord, LanguageIdentities, ServerResourceTypes} from "@poe-vela/core/l10n";
import {GemEntity, GemStatModel} from "@poe-vela/core";

export type PalmCivet = {
  checksums: string;
  common: string;
  items: string;
  static: string;
  stats: string;
  lang: LanguageIdentities
  statsFlat: string;
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
  lang: LanguageIdentities;
  statsFlat: Map<string, string>
  menuSearch: AssetRecord[],
  full: Map<string, string>,
  gemFlat: Map<string, GemEntity>,
  gemNames: Map<string, string>,
  gemStatsFlat: Map<string, GemStatModel[]>,
};

export namespace PalmCivetModel {
  export const empty = (): PalmCivetModel => {
    return {
      items: [],
      static: [],
      stats: [],
      lang: LanguageIdentities["en"],
      checksums: [],
      common: new Map(),
      statsFlat: new Map(),
      menuSearch: [],
      full: new Map(),
      gemFlat: new Map(),
      gemNames: new Map(),
      gemStatsFlat: new Map(),
    }
  }

  export const mapFrom = (entity: PalmCivet): PalmCivetModel => {
    return {
      items: JSON.parse(entity.items),
      static: JSON.parse(entity.static),
      stats: JSON.parse(entity.stats),
      lang: entity.lang,
      checksums: JSON.parse(entity.checksums),
      common: new Map(Object.entries(JSON.parse(entity.common))),
      statsFlat: new Map(Object.entries(JSON.parse(entity.statsFlat))),
      menuSearch: JSON.parse(entity.menuSearch),
      full: new Map(Object.entries(JSON.parse(entity.full))),
      gemFlat: new Map(Object.entries(JSON.parse(entity.gemFlat))),
      gemNames: new Map(Object.entries(JSON.parse(entity.gemNames))),
      gemStatsFlat: new Map(Object.entries(JSON.parse(entity.gemStatsFlat))),
    }
  }

  export function fileNameToField(fileName: string): keyof PalmCivet {
    if (fileName.includes('checksum')) {
      return 'checksums'
    }
    if (fileName.includes('common')) {
      return 'common'
    }
    if (fileName.includes('items')) {
      return 'items'
    }
    if (fileName.includes('static')) {
      return 'static'
    }
    if (fileName.includes('stats')) {
      return 'stats'
    }
    if (fileName.includes('stats.flat')) {
      return 'statsFlat'
    }
    if (fileName.includes('menu-search')) {
      return 'menuSearch'
    }
    if (fileName.includes('full')) {
      return 'full'
    }
    if (fileName.includes('gem.flat')) {
      return 'gemFlat'
    }
    if (fileName.includes('gem.names')) {
      return 'gemNames'
    }
    if (fileName.includes('gem-stats.flat')) {
      return 'gemStatsFlat'
    }
    throw new Error('Unknown file name')
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

export const getPalmCivetFileNames = () => {
  return [
    `checksums.min.json`,
    `common.min.json`,
    `items.min.json`,
    `static.min.json`,
    `stats.min.json`,
    `stats.flat.min.json`,
    `menu-search.min.json`,
    `full.min.json`,
    `gem.flat.min.json`,
    `gem.names.min.json`,
    `gem-stats.flat.min.json`,
  ]
}
