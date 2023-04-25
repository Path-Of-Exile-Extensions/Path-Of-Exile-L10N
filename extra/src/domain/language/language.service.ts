import {
  Language,
  LanguageLocalRepository,
  LanguageRemoteRepository
} from "./language.repository";

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
    let language = await this.languageLocalRepository.getAll();
    debugger
    if (!language) {
      language = await this.languageRemoteRepository.getAll();
    }

    return language;
  }

  /**
   * 从远端更新所有语言
   */
  async updateLanguageAsset(): Promise<any> {
    return this.languageRemoteRepository.getAll()
      .then(res => {
        // 存入本地
        this.languageLocalRepository.saveAll(res);
      })
  }
}
