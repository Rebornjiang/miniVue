import type{ VNode } from '@type/vnode'
import type { patchFn } from '@type/vue'
export function createPatchFunction (options: {domApi:any, modules:any}):patchFn {
  return function patch (oldVnode: VNode | Element | null, vnode: VNode):Element {
    return {} as Element
  }
}
