import {createRxDatabase, RxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";
import {JustLogger} from "../atomic";

export class DB {
  // 单例
  private static instance: DB;
  public driver!: RxDatabase;

  static get Instance(): DB {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }

  public async initialize(): Promise<void> {
    JustLogger.Instance.log("DB Driver initialize");
    this.driver = await createRxDatabase({
      name: 'poe_l10n',
      storage: getRxStorageDexie()
    });
    return Promise.resolve();
  }

  remove(): Promise<string[]> {
    return this.driver.remove();
  }

}
