import {RepositoryBase, RxRepositoryBase} from "@poe-vela/l10n-ext";
import {PalmCivetSchemaLiteral} from "./palm-civet.schema";
import {getPalmCivetFileNames, PalmCivet} from './palm-civet'
import {AssetChecksum, LanguageIdentities} from "@poe-vela/core/l10n";

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

const base = "https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/master/zh-Hans/"

export class StaticRemoteRepository extends RepositoryBase<PalmCivet> {
  all(): Promise<PalmCivet> {
    return Promise
      .all(
        getPalmCivetFileNames()
          .map(fileName => fetch(base + fileName, {cache: "no-store"}))
      )
      .then(res => Promise.all(res.map(i => i.text())))
      .then((
        [checksums, common, items,_static, stats, statsFlat, menuSearch, full, gemFlat, gemNames, gemStatsFlat]
      ) => {
        return {
          checksums,
          common,
          items,
          static: _static,
          stats,
          statsFlat,
          menuSearch,
          lang: LanguageIdentities["zh-Hans"],
          full,
          gemFlat,
          gemNames,
          gemStatsFlat,
        }
      })
  }

  fetch(fileName: string) {
    return fetch(base + fileName, {cache: "no-store"})
  }

  checksum(): Promise<AssetChecksum[]> {
    return fetch(base + `checksums.min.json`, {cache: "no-store"})
      .then(res => res.json())
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
