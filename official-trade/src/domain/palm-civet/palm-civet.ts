import {AssetChecksum, AssetRecord, LanguageIdentities, ServerResourceTypes} from "@poe-vela/core";

export type PalmCivet = {
  checksums: string;
  common: string;
  items: string;
  static: string;
  stats: string;
  statsFlat: string;
  menuSearch: string;
  lang: LanguageIdentities
};

export type PalmCivetModel = {
  checksums: AssetChecksum[]
  common: Record<string, string>
  statsFlat: Record<string, string>
  menuSearch: AssetRecord[],
  version: string;
  static: ServerResourceTypes.Static.Statics[];
  stats: ServerResourceTypes.Stats.Stats[];
  items: ServerResourceTypes.Items.Items[];
  lang: LanguageIdentities;
};

export namespace PalmCivetModel {
  export const mapFrom = (entity: PalmCivet): PalmCivetModel => {
    return {
      items: JSON.parse(entity.items),
      static: JSON.parse(entity.static),
      stats: JSON.parse(entity.stats),
      lang: entity.lang,
      checksums: JSON.parse(entity.checksums),
      common: JSON.parse(entity.common),
      statsFlat: JSON.parse(entity.statsFlat),
    } as PalmCivetModel
  }


  export function fileNameToField(fileName: string) {
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
  }

}

export const getPalmCivetFileNames = (lang: LanguageIdentities) => {
  return [
    `checksums.${lang}.json`,
    `common.min.${lang}.json`,
    `items.min.${lang}.json`,
    `static.min.${lang}.json`,
    `stats.min.${lang}.json`,
    `stats.flat.min.${lang}.json`,
    `menu-search.min.${lang}.json`,
  ]
}
