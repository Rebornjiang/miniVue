// import { isDef } from '@/common/utils'
import { isArray, isDef, isPrimitive, isTrue } from '@/common/utils'
import type{ VNode } from '@type/vnode'
import type { patchFn } from '@type/vue'
import * as nodeOps from './helpers/node-ops'
// nodeOps 类型
type TNodeOps = typeof nodeOps
type NodeOps = {
  [K in keyof TNodeOps] : TNodeOps[K]
}
export function createPatchFunction (options: {nodeOps:NodeOps, modules:any}):patchFn {
  function insert (parent:any, elm:any, ref:any) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref)
        }
      } else {
        nodeOps.appendChild(parent, elm)
      }
    }
  }

  function createChildren (vnode: any, children: any) {
    if (isArray(children)) {
      for (let i = 0, len = children.length; i < len; ++i) {
        createElm(children[i], vnode.elm, null)
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
  }
  function createElm (vnode: VNode, parentElm?: any, refElm?: any) {
    const { tag, children, isComment, text } = vnode
    if (isDef(tag)) {
      vnode.elm = nodeOps.createElement(tag, vnode)
      createChildren(vnode, children)
      insert(parentElm, vnode.elm, refElm)
    } else if (isTrue(isComment)) {
      vnode.elm = nodeOps.createComment(text as string)
      insert(parentElm, vnode.elm, refElm)
    } else {
      vnode.elm = nodeOps.createTextNode(text as string)
      insert(parentElm, vnode.elm, refElm)
    }
  }
  return function patch (oldVnode: any, vnode: VNode):Element {
    // const isRealElement = isDef(oldVnode.nodeType)

    // if (isRealElement) {}
    const parentElm = nodeOps.parentNode(oldVnode)
    createElm(vnode, parentElm, nodeOps.nextSibling(oldVnode))
    nodeOps.removeChild(parentElm as Node, oldVnode)
    return vnode.elm as Element
  }
}
