import {FileBase} from "./file.base";

export class StatsIdFlatFile extends FileBase<Map<string, string>> {
  get fileField() {
    return "statsIdFlat" as const;
  }

  get fileName(): string {
    return "stats.id-flat.min.json";
  }

  parse(data: string) {
    return new Map(Object.entries(JSON.parse(data))) as Map<string, string>;
  }

}
