import {RepositoryBase} from "../../atomic";
import {DB} from "../../driver";
import {PreferenceSchemaLiteral} from "./preference.schema";
import {PreferenceEntity} from "./preference.entity";
import {RxDatabase} from "rxdb";

const Identifier = "preference" as const

export class PreferenceRepository extends RepositoryBase<PreferenceEntity> {
  get database(): RxDatabase {
    return DB.Instance.driver;
  }

  async initialize(): Promise<any> {
    await this.database.addCollections({
      [Identifier]: {
        schema: PreferenceSchemaLiteral
      },
    });
    return Promise.resolve()
  }

  /**
   * 读取第一条数据
   */
  get(): Promise<PreferenceEntity | null> {
    return this.database[Identifier].findOne().exec().then(res => res?.toJSON())
  }

  /**
   * 更新或覆盖
   */
  upsert(struct: PreferenceEntity): Promise<null> {
    struct.id = "1";
    return this.database[Identifier].upsert(struct)
  }

  /**
   * 创建
   */
  async create(struct: PreferenceEntity): Promise<PreferenceEntity> {
    struct.id = "1";
    await this.database[Identifier].insert(struct)
    return Promise.resolve(struct);
  }

  /**
   * 删除
   */
  async delete(): Promise<null> {
    const result = this.database[Identifier].find({
      selector: {
        id: "1"
      }
    });
    await result.remove();
    return Promise.resolve(null);
  }
}
