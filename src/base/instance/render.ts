import type { GlobalAPI } from '@type/global-api'
// import type { Component } from '@type/vue'
import type { VNode } from '@type/vnode'
import installRenderHelpers from './render-helpers'
import type { Component } from '@type/vue'
import { compileToFunctions } from '@/compiler'
import { parseElOption, getOutHtml } from '@/common/utils'
import { CompilerOptions } from '@type/compiler'
import type { ComponentOptions } from '@type/options'
import { mountComponent } from './lifecycle'
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
    el = parseElOption(el)
    const options = vm.$options
    if (!options.render) {
      let template = options.template
      if (template) {
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            // template 是 string， 但仅是 ID 选择器；
            const el = parseElOption(template)
            template = el.innerHTML
          }
        } else if (template.nodeType) {
          // template 直接为 DOM
          template = template.innerHTML
        } else {
          alert('无效模板')
        }
      } else if (el) {
        template = getOutHtml(el)
      }

      if (template && typeof template === 'string') {
        // 调用编译器将 template 转换为 render 函数
        const { render } = compileToFunctions(template, {} as CompilerOptions, vm)
        // compiler 生成的 render 函数不需要 h 函数参数，需要转下类型
        options.render = render as ComponentOptions['render']
      }
    }
    return mountComponent(vm, el)
  }
}
