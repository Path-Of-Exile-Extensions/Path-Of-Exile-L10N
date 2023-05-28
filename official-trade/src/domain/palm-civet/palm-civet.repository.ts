import {RepositoryBase, RxRepositoryBase} from "@poe-vela/l10n-ext";
import {PalmCivetSchemaLiteral} from "./palm-civet.schema";
import {getPalmCivetFileNames, PalmCivet} from './palm-civet'
import {AssetChecksum, LanguageIdentities} from "@poe-vela/core";

export class StaticLocalRepository extends RxRepositoryBase<PalmCivet> {
  get dbName() {
    return "palm-civet";
  }

  async initialize(): Promise<void> {
    await this.database.addCollections({
      [this.dbName]: {
        schema: PalmCivetSchemaLiteral
      },
    });
    return Promise.resolve(undefined);
  }

}

const base = "https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/master/"

export class StaticRemoteRepository extends RepositoryBase<PalmCivet> {
  all(): Promise<PalmCivet> {
    return Promise
      .all(
        getPalmCivetFileNames(LanguageIdentities["zh-Hans"])
          .map(fileName => fetch(base + fileName, {cache: "no-store"}))
      )
      .then(res => Promise.all(res.map(i => i.text())))
      .then(([checksums, common, items,_static, stats, statsFlat, menuSearch]) => {
        return {
          checksums,
          common,
          items,
          static: _static,
          stats,
          statsFlat,
          menuSearch,
          lang: LanguageIdentities["zh-Hans"]
        }
      })
  }

  fetch(fileName: string) {
    return fetch(base + fileName, {cache: "no-store"})
  }

  checksum(): Promise<AssetChecksum[]> {
    const base = "https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/master/"
    return fetch(base + `checksums.zh-Hans.json`, {cache: "no-store"})
      .then(res => res.json())
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
