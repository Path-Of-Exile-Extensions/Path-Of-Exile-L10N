import {StaticLocalRepository, StaticRemoteRepository} from "./palm-civet.repository";
import {PalmCivetModel} from "./palm-civet";
import {AssetChecksum, LanguageIdentities} from "@poe-vela/core/l10n";
import {PalmCivetFiles} from "./palm-civet-files";

export class PalmCivetService {
  // 单例
  private static instance: PalmCivetService;
  public palmCivet: PalmCivetModel;
  public isInitialized = false;

  static get Instance(): PalmCivetService {
    if (!PalmCivetService.instance) {
      PalmCivetService.instance = new PalmCivetService(
        new StaticLocalRepository(),
        new StaticRemoteRepository(),
      );
    }
    return PalmCivetService.instance;
  }

  constructor(
    private readonly localRepository: StaticLocalRepository,
    private readonly remoteRepository: StaticRemoteRepository,
  ) {
    this.palmCivet = PalmCivetModel.empty();
  }

  /**
   * 初始化
   */
  async initialize(): Promise<any> {
    await this.localRepository.initialize();
    await this.remoteRepository.initialize();
    const data = await this.localRepository.findOne()
    if (data) {
      this.palmCivet = PalmCivetFiles.toPalmModel(data)
      this.isInitialized = true;
    }
  }

  deleteAll() {
    this.palmCivet = PalmCivetModel.empty();
    this.isInitialized = false;
    return this.localRepository.deleteAll()
  }

  async get(): Promise<PalmCivetModel> {
    if (this.isInitialized) {
      return Promise.resolve(this.palmCivet);
    }
    return this.update();
  }

  async update(): Promise<PalmCivetModel> {
    const data = await this.localRepository.findOne()
    if (data) {
      const modal = PalmCivetFiles.toPalmModel(data)
      const checksum = await this.remoteRepository.checksum();
      const result = AssetChecksum.diffrences(checksum, modal.checksums)
      for (const [fileName] of result) {
        const response = await this.remoteRepository.fetch(fileName)
        const file = PalmCivetFiles.findByName(fileName)!
        await this.localRepository.upsert({
          [file.fileField]: await response.text(),
          lang: LanguageIdentities["zh-Hans"]
        })
      }
      this.palmCivet = modal;
      return this.palmCivet;
    }
    return this.remoteRepository.all()
      .then(async (res) => {
        await this.localRepository.upsert(res)
        this.palmCivet = PalmCivetFiles.toPalmModel(data)
        return this.palmCivet;
      });
  }

  async forceUpdate(): Promise<void> {
    return this.remoteRepository.all()
      .then(async (res) => {
        await this.localRepository.upsert(res)
        this.palmCivet = PalmCivetFiles.toPalmModel(res)
        return Promise.resolve();
      });
  }

}
