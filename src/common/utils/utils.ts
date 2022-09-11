// 此文件为存工具文件

/**
 * 检查对象上是否有某个属性
 * - 仅检查对象本上，所以 in ，Reflect.has 不能够用;
 * - Object.prototype.hasOwnProperty || Object.hasOwn---- ES2022 新方法
 * */
export function hasOwn (obj: Object, key: string) {
  return Object.hasOwn(obj, key)
}
