import { GlobalAPI } from '@type/global-api'
import { Component } from '@type/vue'
import { isPlainObject, isValidVariable, noop } from '@/common/utils/'
export function stateMixin (Vue:GlobalAPI) {
  // 曝露出 $data ，给其作一层代理, 代理 vm._data
  const dataDef = {
    get () {
      return this._data
    },
    set () {
      alert('请勿更改实例原型上的 $data')
    }
  }

  Object.defineProperty(Vue.prototype, '$data', dataDef)
}

export function initState (vm:Component) {
  const opts = vm.$options

  if (opts.data) {
    initData(vm)
  }
}

function initData (vm: Component) {
  let data = vm.$options.data

  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
  // 将类型缩小
  if (isPlainObject<Object>(data)) {
    // 将定义的 data 数据代理到 vm 上
    const keys = Object.keys(data)
    for (const key of keys) {
      // 需要校验当前 key 是否再 props ，methods 中有过定义
      if (isValidVariable(key)) {
        proxy(vm, '_data', key)
      }
    }
  } else {
    // 此处的 data 为 undefined
    alert('options 若是为函数必须要返回一个对象')
  }
}

function getData (data: Function, vm: Component) {
  try {
    return data.call(vm, vm)
  } catch (error) {
    // 处理错误
  }
}

// 作一层数据代理
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
function proxy (target: Object, sourceKey:string, key:string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val:any) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
