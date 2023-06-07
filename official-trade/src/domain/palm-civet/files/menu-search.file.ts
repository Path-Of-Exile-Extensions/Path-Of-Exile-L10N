import {FileBase} from "./file.base";

export class MenuSearchFile extends FileBase<Record<string, string>> {
  get fileField() {
    return "menuSearch" as const;
  }

  get fileName(): string {
    return "menu-search.min.min.json";
  }

  parse(data: string) {
    return JSON.parse(data);
  }

}
