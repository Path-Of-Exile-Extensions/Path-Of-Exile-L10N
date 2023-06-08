/// <reference types="vite/client" />
/// <reference types="@samrum/vite-plugin-web-extension/client" />

interface ImportMetaEnv {

}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@carbon/icons-vue' {
  export const CheckmarkOutline16: any
  export const CircleDash16: any
  export const CloseOutline16: any
}
