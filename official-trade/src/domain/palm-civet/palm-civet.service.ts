import {StaticLocalRepository, StaticRemoteRepository} from "./palm-civet.repository";
import {PalmCivetModel} from "./palm-civet";
import {AssetChecksum, LanguageIdentities} from "@poe-vela/core";

export class PalmCivetService {
  // 单例
  private static instance: PalmCivetService;
  public palmCivet!: PalmCivetModel;

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

  }

  /**
   * 初始化
   */
  async initialize(): Promise<any> {
    await this.localRepository.initialize();
    await this.remoteRepository.initialize();
  }

  deleteAll() {
    return this.localRepository.deleteAll()
  }

  async update(): Promise<void> {
    const data = await this.localRepository.findOne()
    if (data) {
      const modal = PalmCivetModel.mapFrom(data)
      const checksum = await this.remoteRepository.checksum();
      const result = AssetChecksum.diffrences(checksum, modal.checksums)
      for (const [fileName] of result) {
        const file = await this.remoteRepository.fetch(fileName)
        await this.localRepository.upsert({
          [PalmCivetModel.fileNameToField(fileName)]: await file.text(),
          lang: LanguageIdentities["zh-Hans"]
        })
      }
    }
    return this.remoteRepository.all()
      .then(async (res) => {
        await this.localRepository.upsert(res)
        this.palmCivet = PalmCivetModel.mapFrom(res)
        return;
      });
  }

  async forceUpdate(): Promise<void> {
    return this.remoteRepository.all()
      .then(async (res) => {
        await this.localRepository.upsert(res)
        this.palmCivet = PalmCivetModel.mapFrom(res)
        return;
      });
  }

  public substitutes() {
    localStorage.setItem("lscache-tradedata", JSON.stringify(this.palmCivet.static))
    localStorage.setItem("lscache-tradeitems", JSON.stringify(this.palmCivet.items))
    localStorage.setItem("lscache-tradestats", JSON.stringify(this.palmCivet.stats))
  }

}
