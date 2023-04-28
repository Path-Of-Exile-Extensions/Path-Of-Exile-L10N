import {addRxPlugin} from 'rxdb';
import {CharacterSchemaLiteral} from "./character.schema";
import {LanguageIdentities, RepositoryBase} from "../../atomic";
import {RxDBDevModePlugin} from 'rxdb/plugins/dev-mode';
import {PreferenceService} from "../preference";
import {Character} from "./character";
import {CharacterQuery} from "./character.query";
import {DB} from "../../driver";

addRxPlugin(RxDBDevModePlugin);

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
      [LanguageIdentities["zh-hans"]]: {
        schema: CharacterSchemaLiteral
      },
      [LanguageIdentities["zh-hant"]]: {
        schema: CharacterSchemaLiteral
      },
    });
    return Promise.resolve(undefined);
  }

  insert(struct: Character): Promise<void> {
    return this.database[PreferenceService.Instance.preference.language].insert(struct)
  }

  async upsert(struct: Character): Promise<null> {
    return this.database[PreferenceService.Instance.preference.language]
      .upsert(struct)
  }

  async upsertMany(structs: Character[]) {
    return this.database[PreferenceService.Instance.preference.language]
      .bulkInsert(structs)
  }

  /**
   * 查找
   */
  async query(query: CharacterQuery): Promise<Character[]> {
    return this.database[PreferenceService.Instance.preference.language]
      .find({
        selector: query.toRXQuery(query)
      })
      .exec();
  }

  deleteAll(): Promise<any> {
    return this.database[PreferenceService.Instance.preference.language].remove()
  }

}

export class CharacterRemoteRepository extends RepositoryBase<Character> {
  getCommon(): Promise<Record<string, string>> {
    const base = "https://raw.githubusercontent.com/Path-Of-Exile-Extensions/Path-Of-Exile-Official-Trade-Assets"

    return fetch(base + `/master/` + `common.${LanguageIdentities["zh-hans"]}.json`)
      .then(res => res.json())
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
