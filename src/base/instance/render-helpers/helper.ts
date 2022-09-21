import { isPlainObject } from '@/common/utils'
const _toString = Object.prototype.toString
export function toString (val: any): string {
  // 将 value 转换为字符串：
  // obj || arr => 通过 JSON.stringify 转换
  // other => 调用 String
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}
