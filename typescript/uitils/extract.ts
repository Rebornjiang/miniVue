import { Component } from '@type/vue'

// 想法是从这个 Component 组件实例中提取所有原型上的方法

type PrefixOfFnName = `_${string}`

export type ExtractPrefixType<I, P> = {
  [K in Extract<keyof I, P> as I[K] extends Function ? K : never]: I[K]
}

export type VueCtorPrototype = ExtractPrefixType<Component, PrefixOfFnName>
