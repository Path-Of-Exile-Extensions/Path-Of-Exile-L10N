/**
 * 是否是 poe trade
 */
export function isPoeTrade(): boolean {
  return location.href.includes('/trade/');
}
