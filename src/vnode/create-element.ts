import type{ Component } from '@type/vue'
import type { VNode, VNodeData } from '@type/vnode'
import { isArray, isPrimitive, isTrue } from '@/common/utils'
import VNodeClass, { createEmptyVNode } from './vnode'
import { isReservedTag } from '@/common/utils/element'

// 待实现函数的重载
export const createElement = (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
):VNode | VNode[] => {
  // 对参数进行初始化
  if (isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }

  if (isTrue(alwaysNormalize)) {
    normalizationType = 2
  }

  return _createElement(context, tag, data, children, normalizationType)
}

const _createElement = (context: Component, tag?: string | Function | Component | Object, data?:VNodeData, children?: any, normalizationType?: number):VNode | VNode[] => {
  // basic render
  if (!tag) return createEmptyVNode()

  let vnode
  if (typeof tag === 'string') {
    if (isReservedTag(tag)) {
      vnode = new VNodeClass(tag, data, children, undefined, undefined)
    } else {
      console.warn('未实现 h 生成组件')
      vnode = createEmptyVNode()
    }
  } else {
    console.warn('未实现 h 生成组件')
    vnode = createEmptyVNode()
  }
  return vnode
}
