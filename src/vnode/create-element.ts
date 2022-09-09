import type{ Component } from '@type/vue'
import type { VNode } from '@type/vnode'

export const createElement = (context: Component, tag: string, children: (VNode | string)[] | string):VNode => {
  // 对参数进行初始化

  return _createElement() as VNode
}

const _createElement = () => {
  return {}
}
