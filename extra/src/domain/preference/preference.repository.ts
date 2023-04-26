import {JSONExt} from "../../atomic/json-ext";
import {RepositoryBase} from "../../atomic";

export class PreferenceRepository extends RepositoryBase<PerformanceEntry> {
  db = window.localStorage;

  initialize(): Promise<any> {
    return Promise.resolve()
  }

  get(): Promise<any> {
    const item = JSONExt.parse(this.db.getItem('preference'));
    return Promise.resolve(item);
  }
}
