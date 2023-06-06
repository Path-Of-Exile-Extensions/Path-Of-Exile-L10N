import {addRxPlugin, createRxDatabase, RxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";
import {JustLogger} from "../atomic";
import {RxDBDevModePlugin} from 'rxdb/plugins/dev-mode';
import {RxDBMigrationPlugin} from 'rxdb/plugins/migration';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBDevModePlugin);

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
    this.driver = await createRxDatabase({
      name: 'poe_l10n',
      storage: getRxStorageDexie(),
      ignoreDuplicate: true,
    });
    JustLogger.Instance.log("DB Driver initialized");
    return Promise.resolve();
  }

  remove(): Promise<string[]> {
    return this.driver.remove();
  }

}
