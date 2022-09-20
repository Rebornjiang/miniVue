import type{ Component } from '@type/vue'
import type { VNode } from '@type/vnode'
import { isArray, isPrimitive, isTrue } from '@/common/utils'

export const createElement = (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
):VNode => {
  // 对参数进行初始化
  if (isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }

  if (isTrue(alwaysNormalize)) {
    normalizationType = 2
  }
  return _createElement() as VNode
}

const _createElement = () => {
  return {}
}
