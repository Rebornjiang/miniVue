import type { GlobalAPI } from '@type/global-api'
// import type { Component } from '@type/vue'
import type { VNode } from '@type/vnode'
import installRenderHelpers from './render-helpers'
export function renderMixin (Vue: GlobalAPI) {
  // 给 Vue 原型添加渲染帮助方法，以便 render 函数用到
  installRenderHelpers(Vue.prototype)
  Vue.prototype._render = function (): VNode {
    // const vm:Component = this

    // 后续补充
    const vnode = {}
    return vnode as VNode
  }
}
