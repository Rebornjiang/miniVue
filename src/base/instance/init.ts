import type { constructorOptions, Component } from '@type/vue'
import type { GlobalAPI } from '@type/global-api'

let uid = 0
export function initMixin (Vue:GlobalAPI) {
  Vue.prototype._init = function (options:constructorOptions) {
    const vm: Component = this
    vm._uid = uid++
    vm._isVue = true

    // 合并 options, 目前暂不考虑 子组件的创建
  }
}
