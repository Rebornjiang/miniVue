import { Vue, constructorOptions } from '@type/vue'
let uid = 0
export function initMixin (Vue:Vue) {
  // @ts-ignore
  Vue.prototype._init = function (options:constructorOptions) {
    const vm = this
    vm._uid = uid++
  }
}
