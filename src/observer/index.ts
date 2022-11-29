import { def, hasProto, isArray, isPlainObject } from '@/common/utils'
import { arrayMethods } from './array'
import { Dep } from './dep'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
export function observe (data: any) {
  let ob: Observer | void
  if (!isPlainObject(data) && !isArray(data)) return undefined
  if (Object.isExtensible(data)) {
    ob = new Observer(data)
  }
  return ob
}

export class Observer {
  dep: Dep
  constructor (data: any) {
    this.dep = new Dep()
    // 给响应式对象添加 __ob__ ， 为了数组取用
    def(data, '__ob__', this)
    if (isPlainObject<Record<string, any>>(data)) {
      this.walk(data)
    } else if (isArray(data)) {
      // translate to reactive arr
      if (hasProto) {
        resetProto(data, arrayMethods)
      } else {
        augmentMethodsToCurArr(data, arrayMethods, arrayKeys)
      }
    }
  }

  walk (data: Record<string, any>) {
    const keys = Object.keys(data)
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]
      defineReactive(data, key, data[key])
    }
  }

  obserArray (items: any[]) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

export function defineReactive (
  obj: Record<string, any>,
  key: string | number,
  val?: any
) {
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

function isSameValue (val1: any, val2: any) {
  return val1 === val2
}

function resetProto (target:any, proto:object) {
  Object.setPrototypeOf(target, proto)
}

function augmentMethodsToCurArr (target: object, src: any, keys:string[]) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
