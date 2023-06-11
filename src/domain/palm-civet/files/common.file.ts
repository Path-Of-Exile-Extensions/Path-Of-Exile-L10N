import {FileBase} from "./file.base";

export class CommonFile extends FileBase<Map<string, string>> {
  get fileField() {
    return "common" as const;
  }

  get fileName(): string {
    return "common.min.json";
  }

  parse(data: string) {
    return new Map(Object.entries(JSON.parse(data))) as Map<string, string>;
  }

}
