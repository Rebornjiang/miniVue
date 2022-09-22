import type{ GlobalAPI } from '@type/global-api'
import type{ VNode } from '@type/vnode'
import type{ Component } from '@type/vue'
import patch from '@/vnode/initPatch'
import { createEmptyVNode } from '@/vnode/vnode'
export function lifecycleMixin (Vue: GlobalAPI) {
  // 初始化 patch 方法
  Vue.prototype._patch = patch
  Vue.prototype._update = function (vnode:VNode) {
    const vm:Component = this
    // basic render， $el is Element
    vm.$el = patch(vm.$el as Element, vnode)
  }
}

export function callHook (vm: Component, hook:string) {
  // 再调用 vue 生命周期钩子函数时是不进行依赖收集的
  // const handlers = vm.$options[hook]
  // if (handlers) {

  // }
}

export function mountComponent (vm: Component, el: Element | null | undefined):Component {
  vm.$el = el as Element // 最终 $el 属性是会有的真实的 dom 的
  if (!vm.$options.render || typeof vm.$options.render !== 'function') {
    vm.$options.render = () => createEmptyVNode()
    console.error('无效 render 函数')
  }

  const updateComponent = () => {
    vm._update(vm._render())
  }
  // 仅渲染
  updateComponent()

  if (vm.$vnode) {
    vm._isMounted = true
  }
  return vm
}
