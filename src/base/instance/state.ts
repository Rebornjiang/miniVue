import { GlobalAPI } from '@type/global-api'
import { Component } from '@type/vue'
import { isPlainObject, validVariable, noop, bind, hasOwn } from '@/common/utils/'
import { ComponentOptions } from '@type/options'
import { observe } from '@/observer'
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

  if (opts.methods) initMethods(vm, opts)
  console.log(vm)

  if (opts.data) {
    initData(vm)
  }
}

function initMethods (vm:Component, options: ComponentOptions) {
  const methods = isPlainObject(options.methods) ? options.methods : {} as Record<string, Function>
  const keys = Object.keys(methods)

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    // 校验 methods 的 key 是否与 props 中定义的重复的
    // valid key

    if (validVariable(key)) {
      vm[key] = typeof methods[key] === 'function' ? bind(vm, methods[key]) : noop
    }
  }
}

function initData (vm: Component) {
  let { data, methods } = vm.$options

  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
  // 将类型缩小
  if (isPlainObject<Object>(data)) {
    // 将定义的 data 数据代理到 vm 上
    const keys = Object.keys(data)
    for (const key of keys) {
      // 需要校验当前 key 是否再 props ，methods 中有过定义
      if (hasOwn(methods as Object, key)) {
        console.warn('data 中定义的 key 在 methods 中已经存在')
      }
      if (validVariable(key)) {
        proxy(vm, '_data', key)
      }
    }
  } else {
    // 此处的 data 为 undefined
    alert('options.data 若是为函数必须要返回一个对象')
  }

  // 转换为响应式数据
  observe(data)
  console.log({ data })
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
