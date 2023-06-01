import {CharacterSchemaLiteral} from "./character.schema";
import {RepositoryBase} from "../../atomic";
import {PreferenceService} from "../preference";
import {Character} from "./character";
import {CharacterQuery} from "./character.query";
import {DB} from "../../driver";
import {LanguageIdentities} from "@poe-vela/core/l10n";

/**
 * 这只是一个语义化方法, 把 zh-Hans 转换为 zh_hans
 * @param lang
 */
export const toDBName = (lang: LanguageIdentities) => {
  return lang.split("-")
    .map(i => i.toLowerCase())
    .join("_")
}

// 从远端获取是    Record<USCharacter, string>(Plain对象, 键为英文, 值为翻译)
// 存入本地的是一个 Character
// 从本地取出是一组 Character(Character[])
// 在内存中是   Map<USCharacter, Character>(Map对象, 键为英文, 值为 Character 对象)
export class CharacterLocalRepository extends RepositoryBase<Character> {
  get database() {
    return DB.Instance.driver;
  }

  saveAll(languages: Character[]): Promise<void> {
    return Promise.resolve();
  }

  async initialize(): Promise<void> {
    await this.database.addCollections({
      [toDBName(LanguageIdentities["zh-Hans"])]: {
        schema: CharacterSchemaLiteral
      },
      [toDBName(LanguageIdentities["zh-Hant"])]: {
        schema: CharacterSchemaLiteral
      },
    });
    return Promise.resolve(undefined);
  }

  get dbName() {
    return toDBName(PreferenceService.Instance.preference.language)
  }

  insert(struct: Character): Promise<void> {
    return this.database[this.dbName].insert(struct)
  }

  async upsert(struct: Character): Promise<null> {
    return this.database[this.dbName]
      .upsert(struct)
  }

  async upsertMany(structs: Character[]) {
    return this.database[this.dbName]
      .bulkInsert(structs)
  }

  /**
   * 查找
   */
  async query(query: CharacterQuery): Promise<Character[]> {
    return this.database[this.dbName]
      .find({
        selector: query.toRXQuery(query)
      })
      .exec();
  }

  deleteAll(): Promise<any> {
    return this.database[this.dbName].remove()
  }

}

export class CharacterRemoteRepository extends RepositoryBase<Character> {
  getCommon(): Promise<Record<string, string>> {
    const base = "https://raw.githubusercontent.com/Path-Of-Exile-Extensions/Path-Of-Exile-Official-Trade-Assets"

    return fetch(base + `/master/` + `common.${LanguageIdentities["zh-Hans"]}.json`)
      .then(res => res.json())
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
