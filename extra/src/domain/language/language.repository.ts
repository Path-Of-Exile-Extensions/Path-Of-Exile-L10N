import {addRxPlugin, createRxDatabase, RxDatabase} from 'rxdb';
import {getRxStorageDexie} from 'rxdb/plugins/storage-dexie';
import {CharacterDocType, CharacterSchemaLiteral} from "./language.schema";
import {LanguageIdentities, RepositoryBase} from "../../atomic";
import {RxDBDevModePlugin} from 'rxdb/plugins/dev-mode';
import {PreferenceService} from "../preference";

addRxPlugin(RxDBDevModePlugin);

export interface LanguageRepositoryInterface {
  getCommon(): Promise<Language>;

  // 初始化依赖
  initialize(): Promise<void>;
}

export type Language = Record<string, CharacterDocType>;

export class LanguageLocalRepository extends RepositoryBase<CharacterDocType> implements LanguageRepositoryInterface {
  private database!: RxDatabase;

  getCommon(): Promise<Language> {
    return Promise.resolve({});
  }

  saveAll(languages: Language[]): Promise<void> {
    return Promise.resolve();
  }

  async initialize(): Promise<void> {
    this.database = await createRxDatabase({
      name: 'poe_trade_l10n',
      storage: getRxStorageDexie()
    });
    await this.database.addCollections({
      [LanguageIdentities.ZHSC]: {
        schema: CharacterSchemaLiteral
      },
      [LanguageIdentities.ZHTC]: {
        schema: CharacterSchemaLiteral
      },
    });
    return Promise.resolve(undefined);
  }

  insert(struct: CharacterDocType): Promise<void> {
    return this.database[PreferenceService.Instance.preference.locale].insert({
      c: struct.c,
      cat: struct.cat,
      t: struct.t,
    } as CharacterDocType)
  }

  find(struct: CharacterDocType): Promise<CharacterDocType> {
    return this.database[PreferenceService.Instance.preference.locale].findOne({
      selector: {
        c: {
          $eq: struct.c
        }
      }
    }).exec()
  }

  async upsert(strcu: CharacterDocType): Promise<null> {
    const data = await this.database[PreferenceService.Instance.preference.locale].upsert({
      c: strcu.c,
      cat: strcu.cat,
      t: strcu.t,
    })

    return Promise.resolve(null);
  }
}

export class LanguageRemoteRepository extends RepositoryBase<CharacterDocType> implements LanguageRepositoryInterface {
  getCommon(): Promise<Language> {
    const base = "https://raw.githubusercontent.com/Path-Of-Exile-Extensions/Path-Of-Exile-Official-Trade-Assets"

    return fetch(base + `/master/` + `common.${LanguageIdentities.ZHSC}.json`)
      .then(res => res.json())
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
