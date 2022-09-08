import type { GlobalAPI } from '@type/global-api'
// import type { Component } from '@type/vue'
import type { VNode } from '@type/vnode'
export function renderMixin (Vue: GlobalAPI) {
  Vue.prototype._render = function (): VNode {
    // const vm:Component = this

    // 后续补充
    const vnode = {}
    return vnode as VNode
  }
}
