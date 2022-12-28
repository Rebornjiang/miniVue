import { isArray, isUndef } from '@/common/utils'
import VNode from '../vnode'

// eslint-disable-next-line no-unused-vars
let target:any

function updateDomListeners (oldVnode:VNode, vnode:VNode) {
  console.log('update', oldVnode, vnode)
  if (isUndef(oldVnode.data?.on) && isUndef(vnode.data?.on)) return undefined

  const on = vnode.data?.on ?? {}
  const oldOn = oldVnode.data?.on ?? {}
  target = vnode.elm || oldVnode.elm

  let name: keyof(typeof on), curHanlder, oldHandler
  for (name in on) {
    curHanlder = on[name]
    oldHandler = oldOn[name]
    console.log(curHanlder)
    if (isUndef(curHanlder)) {
      console.warn('handler 不存在')
    } else if (isUndef(oldHandler)) {
      if (isUndef(curHanlder.fns)) {
        curHanlder = createFnInvoker(curHanlder)
      }
      add(name, curHanlder)
    } else if (curHanlder !== oldHandler) {
      oldHandler.fns = curHanlder
      on[name] = oldHandler
    }
  }

  for (name in oldOn) {
    if (isUndef(on[name])) {
      remove(name, on[name])
    }
  }
}

function createFnInvoker (fns: Function | Function[]) {
  function invoker () {
    const fns = invoker.fns
    if (isArray(fns)) {
      const cloned = fns.slice()
      cloned.forEach(fn => {
        // @ts-ignore
        fn.call(this, ...arguments)
      })
    } else {
      // @ts-ignore
      fns.call(this, ...arguments)
    }
  }
  invoker.fns = fns
  return invoker
}

function add (name: string, handler: Function) {
  const dom:Element = target
  dom.addEventListener(name as any, handler as any)
}

function remove (name: string, handler: Function) {
  const dom:Element = target
  dom.removeEventListener(name as any, handler as any)
}

export default {
  created: updateDomListeners,
  update: updateDomListeners
}
