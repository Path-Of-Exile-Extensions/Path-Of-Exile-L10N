import {createRxDatabase, RxDatabase} from 'rxdb';
import {getRxStorageDexie} from "rxdb/dist/types/plugins/storage-dexie";
import LanguageSchema from "./language.schema";

export interface LanguageRepositoryInterface {
  getAll(): Promise<Language[]>;

  // 初始化依赖
  initialize(): Promise<void>;
}

export type Language = any;

export class LanguageLocalRepository implements LanguageRepositoryInterface {
  private database!: RxDatabase;

  getAll(): Promise<Language[]> {
    this.database
    return Promise.resolve([]);
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
      languages: {
        schema: LanguageSchema
      }
    })
    this.database.languages.find({
      selector: {
        name: 'zh'
      }
    })
    return Promise.resolve(undefined);
  }
}

export class LanguageRemoteRepository implements LanguageRepositoryInterface {
  getAll(): Promise<Language[]> {
    return fetch("https://raw.githubusercontent.com/Path-Of-Exile-Extensions/Path-Of-Exile-Official-Trade-Assets/master/assets.json")
      .then(res => res.json())
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
