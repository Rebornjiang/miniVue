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
    console.log(vm.$options, 'options')

    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
