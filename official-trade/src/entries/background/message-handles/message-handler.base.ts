import {ExtMessage} from "@poe-vela/core/browser";

export class MessageHandlerBase {
  handle(message: ExtMessage, ...args: any[]) {
    throw new Error("Method not implemented.");
  }
}
