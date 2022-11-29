import { GlobalAPI } from '@type/global-api'
import { Component } from '@type/vue'
import { isPlainObject, validVariable, noop, bind, hasOwn, isArray } from '@/common/utils/'
import { ComponentOptions } from '@type/options'
import { observe } from '@/observer'
import { Watcher } from '@/observer/watcher'
import { Dep, popTarget, pushTarget } from '@/observer/dep'
import { nativeWatch } from '@/common/constants'
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

  Vue.prototype.$watch = function (expOrFn, handler, options) {
    const vm:Component = this
    // 非 通过options 定义的  watch, 第二参数允许省略直接传入 options
    if (isPlainObject<any>(handler)) {
      return createWatcher(vm, expOrFn, handler, options)
    }

    options.user = true

    const watcher = new Watcher(vm, expOrFn, handler, options)
    if (options.immediate) {
      pushTarget()
      try {
        watcher.cb?.()
      } catch (error) {
        console.warn(error, 'watcher CB')
      }
      popTarget()
    }

    return () => {
      watcher.teardown()
    }
  }
}

export function initState (vm:Component) {
  vm._watchers = []
  const opts = vm.$options

  if (opts.methods) initMethods(vm, opts)

  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {})
  }

  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) initWatcher(vm, opts.watch)
}

const ComputedOptions = {
  lazy: true
}

function initWatcher (vm:Component, watchs: any) {
  if (!isPlainObject<any>(watchs)) return
  for (const key in watchs) {
    const watch = watchs[key]
    if (isArray(watch)) {
      for (let i = 0, len = watch.length; i < len; i++) {
        createWatcher(vm, key, watch[i])
      }
    } else {
      createWatcher(vm, key, watch)
    }
  }
}

function createWatcher (vm:Component, expOrFn:string | Function, handler: any, options?: object) {
  if (isPlainObject<any>(handler)) {
    options = handler
    handler = handler.handler
  }

  if (typeof handler === 'string') {
    handler = vm[handler]
  }

  vm.$watch(expOrFn, handler, options)
}

function initComputed (vm: Component, computed: any) {
  const watchers:Component['_computedWatchers'] = (vm._computedWatchers = {})
  const keys = Object.keys(computed)
  for (const key of keys) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    watchers[key] = new Watcher(vm, getter, noop, ComputedOptions)

    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
  }
}

function createComputedGetter (key:string) {
  return function ComputedGetter () {
    const watcher:Watcher = this._computedWatchers && this._computedWatchers[key]

    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }

      if (Dep.target) {
        watcher.depend()
      }
    }

    return watcher.value
  }
}

function ComputedGetterOfNoCache (fn:Function) {
  return function ComputedGetter () {
    return fn.call(this, this)
  }
}

function defineComputed (vm: Component, key: string, userDef: Function | {get:Function, set?:Function, [key:string]:any}) {
  let getter, setter
  if (typeof userDef === 'function') {
    getter = createComputedGetter(key)
  } else {
    // computed 不带缓存，相当于函数
    getter = userDef.cache !== false
      ? createComputedGetter(key)
      : ComputedGetterOfNoCache(userDef.get)

    setter = userDef.set || noop
  }
  Object.defineProperty(vm, key, { get: getter, set: (setter || noop) as any })
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
  let { data, methods = {} } = vm.$options

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
