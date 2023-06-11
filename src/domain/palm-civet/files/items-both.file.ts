import {FileBase} from "./file.base";

export class ItemsBothFile extends FileBase<Record<string, string>> {
  get fileField() {
    return "itemsBoth" as const;
  }

  get fileName(): string {
    return "items.both.min.json";
  }

  parse(data: string) {
    return JSON.parse(data);
  }

}
