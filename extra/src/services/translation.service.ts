import { Character } from "../domain/character/character";
import { CharacterService } from '../domain/character/character.service';

export class TranslationService {
  private static _instance: TranslationService;

  private readonly characterService: CharacterService;

  static get Instance() {
    if (!this._instance) {
      this._instance = new TranslationService(CharacterService.Instance);
    }
    return this._instance;
  }

  constructor(
    characterService: CharacterService,
  ) {
    this.characterService = characterService;
  }

  // 翻译
  translate(usString: string): Character | undefined {
    return this.characterService.findATranslation(usString);
  }
}
