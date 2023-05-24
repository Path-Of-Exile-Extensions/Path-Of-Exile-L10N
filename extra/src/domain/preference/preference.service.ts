import { JustLogger } from "../../atomic/logger";
import {PreferenceEntity, PreferenceEntityDefault} from "./preference.entity";
import {PreferenceRepository} from "./preference.repository";

export class PreferenceService {
  // 单例
  private static instance: PreferenceService;

  // 内存中缓存的偏好设置
  private _preference!: PreferenceEntity;

  static get Instance(): PreferenceService {
    if (!PreferenceService.instance) {
      PreferenceService.instance = new PreferenceService(
        new PreferenceRepository(),
      );
    }
    return PreferenceService.instance;
  }

  constructor(
    private readonly preferenceRepository: PreferenceRepository,
  ) {

  }

  async initialize(): Promise<PreferenceEntity> {
    await this.preferenceRepository.initialize();
    const data = await this.preferenceRepository.get();
    if (data) {
      this._preference = data;
    } else {
      this._preference = PreferenceEntityDefault
      // 更新本地
      await this.preferenceRepository.create(this._preference);
    }
    JustLogger.Instance.log("Preference initialized");
    return Promise.resolve(this.preference);
  }

  get preference(): PreferenceEntity {
    return this._preference;
  }

  async upsert(preference: Partial<PreferenceEntity>): Promise<any> {
    this._preference = {
      ...this._preference,
      ...preference,
    }

    return this.preferenceRepository.upsert(this._preference);
  }

}
