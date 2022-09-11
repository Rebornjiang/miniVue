import type { GlobalAPI } from '@type/global-api'
// import type { Component } from '@type/vue'
import type { VNode } from '@type/vnode'
import installRenderHelpers from './render-helpers'
import type { Component } from '@type/vue'
export function renderMixin (Vue: GlobalAPI) {
  // 给 Vue 原型添加渲染帮助方法，以便 render 函数用到
  installRenderHelpers(Vue.prototype)
  Vue.prototype._render = function () {
    // const vm:Component = this

    // 后续补充
    const vnode = {}
    return vnode as VNode
  }

  /**
  * 初始化 Vue 编译器
  * 在这里需要给 Vue 的原型添加 $mount 方法，方便实例进行挂载
  * */

  Vue.prototype.$mount = function (el) {
    const vm: Component = this
    // const elDom = parseElOptions(el)
    // const { options } = vm
    return vm
  }
}

// function parseElOptions (el:string | Element):Element {
//   let domRt
//   if (el && typeof el === 'string') {
//     const dom = document.querySelector(el)
//     domRt = dom
//   }
//   domRt = el as Element
//   return domRt
// }
