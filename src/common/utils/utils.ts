// 此文件为存工具文件

/**
 * 检查对象上是否有某个属性
 * - 仅检查对象本上，所以 in ，Reflect.has 不能够用;
 * - Object.prototype.hasOwnProperty || Object.hasOwn---- ES2022 新方法
 * */
export function hasOwn (obj: Object, key: string) {
  return Object.hasOwn(obj, key)
}

const _toString = Object.prototype.toString
export function isPlainObject<T = boolean> (obj:any):obj is T {
  return _toString.call(obj) === '[object Object]'
}

// 检查是否是以 $ || _ 开头的
export function isValidVariable (v: string):boolean {
  const ascCode = v.charCodeAt(0)
  return ascCode !== 0x24 && ascCode !== 0x5f
}

export const noop = (a?:any, b?:any, c?:any) => {}

// 将 from 对象本身及其原型链上的所有方法 copy 到 to 对象上
export function extend (to: Record<keyof any, any>, from?: Record<keyof any, any>):Record<keyof any, any> {
  for (const key in from) {
    to[key] = from[key]
  }
  return to
}
