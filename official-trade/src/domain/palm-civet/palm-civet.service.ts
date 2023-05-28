import {StaticLocalRepository, StaticRemoteRepository} from "./palm-civet.repository";
import {PalmCivetModel} from "./palm-civet";

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
      const version = await this.remoteRepository.version();
      if (data.version === version) {
        this.palmCivet = PalmCivetModel.mapFrom(data)
        return;
      }
    }
    return this.remoteRepository.fetch()
      .then(async (res) => {
        await this.localRepository.upsert(res)
        this.palmCivet = PalmCivetModel.mapFrom(res)
        return;
      });
  }

  async forceUpdate(): Promise<void> {
    return this.remoteRepository.fetch()
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
