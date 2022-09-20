import type{ GlobalAPI } from '@type/global-api'
// 在 vm  调用 render 函数的时候会用到许多的帮助方法
import { createTextVNode } from '@/vnode/vnode'
import type{ Component } from '@type/vue'
import { createElement } from '@/vnode/create-element'

export default function installRenderHelpers (target:GlobalAPI['prototype']) {
  target._v = createTextVNode
  // _e
  // _s
  // 与源码不相同，_c 可以放在这里进行初始化，这样只需要初始化一次
  target._c = function (tag, children) {
    const vm:Component = this
    return createElement(vm, tag, children)
  }
}
