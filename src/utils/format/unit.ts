import { isDef } from '..';
import { isNumber } from '../validate/number';

/**
 * 如果是数值，为value添加单位
 * @param value
 */
export function addUnit(value?: string | number): string | undefined {
  // value是null或undefined
  if (!isDef(value)) {
    return undefined;
  }

  // 一律转成字符串
  value = String(value);
  // isNumber 数字型字符串
  // 如果是，就带上px单位
  return isNumber(value) ? `${value}px` : value;
}
