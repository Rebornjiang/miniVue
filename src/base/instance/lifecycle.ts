import type{ GlobalAPI } from '@type/global-api'
import type{ VNode } from '@type/vnode'
import type{ Component } from '@type/vue'
import patch from '@/vnode/initPatch'
export function lifecycleMixin (Vue: GlobalAPI) {
  // 初始化 patch 方法
  Vue.prototype._patch = patch
  Vue.prototype._update = function (vnode:VNode) {
    // const vm:Component = this
    // console.log(vm)
  }
}

export function callHook (vm: Component, hook:string) {
  // 再调用 vue 生命周期钩子函数时是不进行依赖收集的
  // const handlers = vm.$options[hook]
  // if (handlers) {

  // }
}
