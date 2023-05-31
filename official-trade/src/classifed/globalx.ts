import {Runtime} from "webextension-polyfill";

export namespace globalx {
  export let port: Runtime.Port | null = null
}
