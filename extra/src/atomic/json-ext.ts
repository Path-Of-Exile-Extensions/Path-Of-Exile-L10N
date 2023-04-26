export namespace JSONExt {
  export function parse<T>(json: string | null): T | null {
    if (!json) {
      return null;
    }
    try {
      return JSON.parse(json)
    } catch (e) {
      return null;
    }
  }
}
