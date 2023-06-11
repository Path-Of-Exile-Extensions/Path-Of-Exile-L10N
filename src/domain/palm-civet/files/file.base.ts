import {PalmCivet} from "@/domain/palm-civet";

export abstract class FileBase<T> {
  abstract get fileName(): string;
  abstract get fileField(): keyof PalmCivet;
  abstract parse(data: string): T;
}
