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
export function validVariable (v: string):boolean {
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

// 基于一个 str（"prop1, prop2,prop3"） 创造一个 MAP，缓存 map 对象，返回一个检验函数判断某个值是否存在 Map 对象中。
export function makeMap (str:string, expectsLowerCase?:boolean):(val:string) => boolean | undefined {
  const map:Record<string, boolean> = Object.create(null)
  const list: string[] = str.split(',')
  for (let i = 0, len = list.length; i < len; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val]
}

export function cached<R> (fn:(val: string) => R):(val: string) => R {
  const cached:Record<string, R> = Object.create(null)
  return function cachedFn (val: string) {
    const hit = cached[val]
    return hit || (cached[val] = fn(val))
  }
}

export const isArray = Array.isArray

export function isPrimitive (value: any): boolean {
  return (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'symbol')
}

export const isTrue = (v:any):boolean => v === true
export const isFalse = (v:any):boolean => v === false

export function isDef<T = any> (val: T): val is NonNullable<T> {
  return val !== undefined && val !== null
}

export function bind (target: object, fn:Function):Function {
  return Function.prototype.bind.call(fn, target)
}
