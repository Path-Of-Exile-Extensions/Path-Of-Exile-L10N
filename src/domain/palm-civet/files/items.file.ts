import {FileBase} from "./file.base";

export class ItemsFile extends FileBase<Record<string, string>> {
  get fileField() {
    return "items" as const;
  }

  get fileName(): string {
    return "items.min.json";
  }

  parse(data: string) {
    return JSON.parse(data);
  }

}
