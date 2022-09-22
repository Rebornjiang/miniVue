import type { constructorOptions, Component } from '@type/vue'
import type { GlobalAPI } from '@type/global-api'
import { mergeOptions } from '@/common/utils/'
import { initState } from './state'

let uid = 0
export function initMixin (Vue:GlobalAPI) {
  Vue.prototype._init = function (options:constructorOptions) {
    const vm: Component = this
    vm._uid = uid++

    // 合并 options, 目前暂不考虑 子组件的创建
    if (options) {
      vm.$options = mergeOptions(Vue.options || {}, options, vm)
    }

    // 初始化 render 函数中的 this,为了检查 渲染函数调用时所访问的属性是否符合规范，对于不符合规范给出 vue warn

    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
