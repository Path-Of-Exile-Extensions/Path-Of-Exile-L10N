import {LanguageLocalRepository, LanguageRemoteRepository} from "./language.repository";
import {isNilOrEmpty} from "../../atomic/is";
import {JustLogger} from "../../atomic";
import {CharacterDocType} from "./language.schema";

export class LanguageService {
  // 单例
  private static instance: LanguageService;

  static get Instance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService(
        new LanguageLocalRepository(),
        new LanguageRemoteRepository(),
      );
    }
    return LanguageService.instance;
  }

  // 基础语言包
  private _baseLanguages!:  Map<string, CharacterDocType>;
  // 特性语言包
  private _descriptionLanguages!: Map<string, CharacterDocType>;

  constructor(
    private readonly languageLocalRepository: LanguageLocalRepository,
    private readonly languageRemoteRepository: LanguageRemoteRepository,
  ) {

  }

  /**
   * 初始化
   */
  async initialize(): Promise<any> {
    await this.languageLocalRepository.initialize();
    await this.languageRemoteRepository.initialize();
    // 先判断本地有没有, 如果本地没有就从远端获取
    let common = await this.languageLocalRepository.getCommon();
    if (isNilOrEmpty(common)) {
      common = await this.languageRemoteRepository.getCommon();
    }
    this._baseLanguages = new Map(Object.entries(common));
    JustLogger.Instance.info("LanguageService initialized", this._baseLanguages)
    return Promise.resolve();
  }

  /**
   * 从远端更新所有语言
   */
  async updateLanguageAsset(): Promise<any> {
    return Promise.resolve();
    // return this.languageRemoteRepository.getAll()
    //   .then(res => {
    //     // 存入本地
    //     this.languageLocalRepository.saveAll(res);
    //   })
  }
}
