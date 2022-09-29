import type{ Component } from '@type/vue'

// 想法是从这个 Component 组件实例中提取所有原型上的方法

type PrefixOfFnName = `_${string}`

export type RemoveIdxSign<I> = {
  [K in keyof I as string extends K ? never : number extends K ? never : K]: I[K]
}
// 运算需要去掉索引签名类型
export type ExtractPrefixType<I, P> = {
  [K in Extract<keyof I, P> as I[K] extends Function ? K : never ]: I[K]
}

export type VueCtorPrototype = ExtractPrefixType<RemoveIdxSign<Component>, PrefixOfFnName>

// 从一个接口中取出所有的方法
export type ExtractAllFnFromInterface<T> = {
  [K in keyof T as T [K] extends Function ? K :never] : T[K]
}
