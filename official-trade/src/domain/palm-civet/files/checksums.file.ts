import {FileBase} from "./file.base";
import {AssetChecksum} from "@poe-vela/core/l10n";

export class ChecksumsFile extends FileBase<AssetChecksum> {
  get fileField() {
    return "checksums" as const;
  }

  get fileName(): string {
    return "checksums.min.json";
  }

  parse(data: string) {
    return JSON.parse(data) as AssetChecksum;
  }

}
