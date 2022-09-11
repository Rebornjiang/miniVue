import type { constructorOptions, Component } from '@type/vue'
import type { GlobalAPI } from '@type/global-api'
import { mergeOptions } from '@/common/utils/options'

let uid = 0
export function initMixin (Vue:GlobalAPI) {
  Vue.prototype._init = function (options:constructorOptions) {
    const vm: Component = this
    vm._uid = uid++
    vm._isVue = true

    // 合并 options, 目前暂不考虑 子组件的创建
    if (options) {
      vm.$options = mergeOptions(Vue.options, options, vm)
    }

    // vm._self = vm
  }
}
