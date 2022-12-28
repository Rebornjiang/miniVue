// import { isDef } from '@/common/utils'
import { isArray, isDef, isPrimitive, isTrue } from '@/common/utils'
import type{ VNode, MoludeType } from '@type/vnode'
import type { patchFn } from '@type/vue'
import * as nodeOps from './helpers/node-ops'
import modules from './modules'
import ClassVnode from './vnode'

// nodeOps 类型
type TNodeOps = typeof nodeOps
type NodeOps = {
  [K in keyof TNodeOps] : TNodeOps[K]
}
type Hooks = ['created', 'update']
// const hooks:Hooks = ['created', 'update']

type CbsType = {
  // eslint-disable-next-line no-unused-vars
  [K in Hooks[number]]:any[]
}

const empltyVnode = new ClassVnode('', {}, [])
export function createPatchFunction (options: {nodeOps:NodeOps, modules:MoludeType[]}):patchFn {
  const cbs:CbsType = {
    created: [],
    update: []
  }

  for (let i = 0, len = modules.length; i < len; i++) {
    const curModule = modules[i]
    let key:keyof (typeof curModule)
    for (key in curModule) {
      if (key in cbs) cbs[key].push(curModule[key])
    }
  }

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
  function invokeCreateHooks (vnode:VNode) {
    cbs.created.forEach(cb => {
      cb(empltyVnode, vnode)
    })
    const hook = vnode.data?.hooks
    if (isDef(hook)) {
      if (isDef(hook.create)) hook.create(empltyVnode, vnode)
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
    const { tag, children, isComment, text, data } = vnode
    if (isDef(tag)) {
      vnode.elm = nodeOps.createElement(tag, vnode)
      createChildren(vnode, children)
      // 调用各个模块中的 created 钩子
      if (data) {
        invokeCreateHooks(vnode)
      }

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
