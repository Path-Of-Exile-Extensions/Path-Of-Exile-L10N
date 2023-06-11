import {FileBase} from "./file.base";

export class StatsFile extends FileBase<Record<string, string>> {
  get fileField() {
    return "stats" as const;
  }

  get fileName(): string {
    return "stats.min.json";
  }

  parse(data: string) {
    return JSON.parse(data);
  }

}
