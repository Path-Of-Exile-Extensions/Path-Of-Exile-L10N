import {FileBase} from "./file.base";

export class StaticFile extends FileBase<Record<string, string>> {
  get fileField() {
    return "static" as const;
  }

  get fileName(): string {
    return "static.min.json";
  }

  parse(data: string) {
    return JSON.parse(data);
  }

}
