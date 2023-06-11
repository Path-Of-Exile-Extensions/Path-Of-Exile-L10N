import {FileBase} from "./file.base";

export class FullFile extends FileBase<Map<string, string>> {
  get fileField() {
    return "full" as const;
  }

  get fileName(): string {
    return "full.min.json";
  }

  parse(data: string) {
    return new Map(Object.entries(JSON.parse(data))) as Map<string, string>;
  }

}
