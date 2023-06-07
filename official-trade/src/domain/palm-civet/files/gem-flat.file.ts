import {FileBase} from "./file.base";
import {GemEntity} from "@poe-vela/core";

export class GemFlatFile extends FileBase<Map<string, GemEntity[]>> {
  get fileField() {
    return "gemFlat" as const;
  }

  get fileName(): string {
    return "gem.flat.min.json";
  }

  parse(data: string) {
    return new Map(Object.entries(JSON.parse(data))) as Map<string, GemEntity[]>;
  }

}
