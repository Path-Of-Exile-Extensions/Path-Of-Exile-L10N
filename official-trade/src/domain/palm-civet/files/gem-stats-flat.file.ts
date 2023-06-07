import {FileBase} from "./file.base";
import {GemStatModel} from "@poe-vela/core";

export class GemStatsFlatFile extends FileBase<Map<string, GemStatModel[]>> {
  get fileField() {
    return "gemStatsFlat" as const;
  }

  get fileName(): string {
    return "gem-stats.flat.min.json";
  }

  parse(data: string) {
    return new Map(Object.entries(JSON.parse(data))) as Map<string, GemStatModel[]>;
  }

}
