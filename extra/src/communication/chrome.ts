import {CommunicationActionBase} from "./base";

export namespace ChromeCommunicationAction {
  export type Actions = UpdateAssets | ClearCaches;

  export class UpdateAssets extends CommunicationActionBase {
    public readonly TAG = "UpdateAssets";
  }

  export class ClearCaches extends CommunicationActionBase {
    public readonly TAG = "ClearCaches";
  }

}
