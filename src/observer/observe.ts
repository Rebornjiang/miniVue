import { isArray, isPlainObject } from '@/common/utils'
import { Dep } from './dep'
export function observe (data: any) {
  let ob:Observer | void
  if (!isPlainObject(data) && !isArray(data)) return undefined
  if (Object.isExtensible(data)) {
    ob = new Observer(data)
    console.log(ob)
  }
  return ob
}

class Observer {
  dep : Dep
  constructor (data:any) {
    this.dep = new Dep()
    if (isPlainObject<Record<string, any>>(data)) {
      this.walk(data)
    }
  }

  walk (data:Record<string, any>) {
    const keys = Object.keys(data)

    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]
      defineReactive(data, key, data[key])
    }
  }
}

export function defineReactive (obj: Record<string, any>, key:string | number, val?:any) {
  const dep = new Dep()
  const isChildren = observe(val)
  Object.defineProperty(obj, key, {
    get: function propGetter () {
      if (Dep.target) {
        dep.depend()
        if (isChildren) {
          isChildren.dep.depend()
        }
      }
      return val
    },

    set: function propSetter (value) {
      if (isSameValue(val, value)) return undefined
      if (isPlainObject(value) || isArray(value)) observe(value)
      val = value
      dep.notify()
    }
  })
}

function isSameValue (val1: any, val2:any) {
  return val1 === val2
}
