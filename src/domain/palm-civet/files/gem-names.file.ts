import {FileBase} from "./file.base";

export class GemNamesFile extends FileBase<Map<string, string>> {
  get fileField() {
    return "gemNames" as const;
  }

  get fileName(): string {
    return "gem.names.min.json";
  }

  parse(data: string) {
    return new Map(Object.entries(JSON.parse(data))) as Map<string, string>;
  }

}
