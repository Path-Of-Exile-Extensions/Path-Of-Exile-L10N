import {CharacterLocalRepository, CharacterRemoteRepository} from "./character.repository";
import {Character, CharacterCategory} from "./character";
import {isEmptyArray, isEmptyObject, JustLogger} from "../../atomic";
import {CharacterCriteria, CharacterQuery} from "./character.query";

export class CharacterService {
  // 单例
  private static instance: CharacterService;

  static get Instance(): CharacterService {
    if (!CharacterService.instance) {
      CharacterService.instance = new CharacterService(
        new CharacterLocalRepository(),
        new CharacterRemoteRepository(),
      );
    }
    return CharacterService.instance;
  }

  // 基础语言包
  private _baseLanguages!: Map<string, Character>;
  // 特性语言包
  private _descriptionLanguages!: Map<string, Character>;

  constructor(
    private readonly localRepository: CharacterLocalRepository,
    private readonly remoteRepository: CharacterRemoteRepository,
  ) {

  }

  /**
   * 初始化
   */
  async initialize(): Promise<any> {
    await this.localRepository.initialize();
    await this.remoteRepository.initialize();
    // 先判断本地有没有, 如果本地没有就从远端获取
    let common = await this.getCommonFromLocal();
    if (isEmptyArray(common)) {
      const remoteAssets = await this.getCommonFromRemote();
      // 存入本地
      await this.localRepository.upsertMany(CharacterTransforms.painRecordToArray(remoteAssets, CharacterCategory.common));
      this._baseLanguages = CharacterTransforms.painRecordToMap(remoteAssets, CharacterCategory.common);
    } else {
      this._baseLanguages = CharacterTransforms.arrayToMap(common);
    }
    JustLogger.Instance.info("LanguageService initialized", this._baseLanguages)
    return Promise.resolve();
  }

  /**
   * 从远端更新所有语言
   */
  async updateLanguageAsset(): Promise<any> {
    return Promise.resolve();
    // return this.remoteRepository.getAll()
    //   .then(res => {
    //     // 存入本地
    //     this.localRepository.saveAll(res);
    //   })
  }

  /**
   * 从本地获取基础语言包
   */
  getCommonFromLocal(): Promise<Character[]> {
    return this.localRepository.query(
      new CharacterQuery(
        new CharacterCriteria(undefined, CharacterCategory.common)
      )
    )
  }

  /**
   * 从远端获取基础语言包
   */
  async getCommonFromRemote(): Promise<Record<string, string>> {
    return await this.remoteRepository.getCommon();
  }

  /**
   * 清除本地语言包
   */
  clearCaches(): Promise<void> {
    return this.localRepository.deleteAll();
  }

  /**
   * 更新语言包
   */
  updateAssets() {

  }
}

const CharacterTransforms = {
  // 数组转换为Map
  arrayToMap: (array: Character[]): Map<string, Character> => {
    const map = new Map<string, Character>();
    array.forEach((item: Character) => {
      map.set(item.u, item);
    })
    return map;
  },
  // Map转换为数组
  mapToArray: (map: Map<string, Character>): Character[] => {
    const array: Character[] = [];
    map.forEach((value: Character) => {
      array.push(value);
    })
    return array;
  },
  kvToCharacter: (us: string, character: string, category: CharacterCategory): Character => {
    return {
      u: us,
      c: character,
      cat: category
    };
  },
  // 从远端获取的数据转换为 Map
  painRecordToMap: (remote: Record<string, string>, category: CharacterCategory): Map<string, Character> => {
    const map = new Map<string, Character>();
    Object.entries(remote).forEach(([us, character]) => {
      map.set(us, CharacterTransforms.kvToCharacter(us, character, category));
    })
    return map;
  },
  // 从远端获取的数据转换为 数组
  painRecordToArray: (remote: Record<string, string>, category: CharacterCategory): Character[] => {
    const array: Character[] = [];
    Object.entries(remote).forEach(([us, character]) => {
      array.push(CharacterTransforms.kvToCharacter(us, character, category));
    })
    return array;
  }
}
