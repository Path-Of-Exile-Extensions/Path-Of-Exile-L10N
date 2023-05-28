import {LanguageIdentities, ServerResourceTypes} from "@poe-vela/core";

export type PalmCivet = {
  version: string;
  static: string;
  stats: string;
  items: string;
  language: LanguageIdentities;
};

export type PalmCivetModel = {
  version: string;
  static: ServerResourceTypes.Static.Statics[];
  stats: ServerResourceTypes.Stats.Stats[];
  items: ServerResourceTypes.Items.Items[];
  language: LanguageIdentities;
};

export namespace PalmCivetModel {
  export const mapFrom = (entity: PalmCivet): PalmCivetModel => {
    return {
      version: entity.version,
      items: JSON.parse(entity.items).result,
      static: JSON.parse(entity.static).result,
      stats: JSON.parse(entity.stats).result,
      language: entity.language,
    }
  }
}
