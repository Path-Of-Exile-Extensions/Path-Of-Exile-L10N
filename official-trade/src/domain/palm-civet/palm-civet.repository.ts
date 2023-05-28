import {RepositoryBase, RxRepositoryBase} from "@poe-vela/l10n-ext";
import {PalmCivetSchemaLiteral} from "./palm-civet.schema";
import {PalmCivet} from './palm-civet'
import {LanguageIdentities} from "@poe-vela/core";

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

export class StaticRemoteRepository extends RepositoryBase<PalmCivet> {
  fetch(): Promise<PalmCivet> {
    const base = "https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/master/"

    return Promise
      .all([
        fetch(base + `version.txt`, {cache: "no-cache"}),
        fetch(base + `items.min.json`, {cache: "no-cache"}),
        fetch(base + `stats.min.json`, {cache: "no-cache"}),
        fetch(base + `static.min.json`, {cache: "no-cache"}),
      ])
      .then(res => Promise.all(res.map(i => i.text())))
      .then(([version, items, stats, _static]) => {
        return {
          version: version.trim(),
          items: items,
          static: _static,
          stats: stats,
          language: LanguageIdentities["zh-Hans"],
        }
      })
  }

  version(): Promise<string> {
    const base = "https://raw.githubusercontent.com/Path-Of-Exile-Vela/L10N-Assets/master/"
    return fetch(base + `version.txt`, {cache: "no-cache"}).then(res => res.text())
      .then(res => res.trim())
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
