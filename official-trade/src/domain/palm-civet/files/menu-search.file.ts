import {FileBase} from "./file.base";
import {AssetVendorMinimize} from "@poe-vela/core/l10n";

export class MenuSearchFile extends FileBase<Record<string, AssetVendorMinimize>> {
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
