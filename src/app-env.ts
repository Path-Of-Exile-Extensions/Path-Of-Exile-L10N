export namespace AppEnv {
  export const IsDev = import.meta.env.DEV;
  // 是否是 ContentScript, 不知道是否会影响到 options 页面
  export const IsContentScript = location.href.includes("http");
}
