import type { Component } from '@type/vue'
import type { ComponentOptions } from '@type/options'
import { extend, hasOwn, isPlainObject } from './utils'

// 创建合并策略
const strategy = Object.create(null)

function mergeData (to: Record<string | symbol, any>) {
  return to
}

function mergeDataOrFn (parentVal: any, childVal: any, vm?: Component) {
  if (!vm) {
    // 子组件merge命中
  }

  return function mergeInstanceDataFn () {
    const instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal

    return mergeData(instanceData)
    // const defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal
    // if (instanceData) {
    //   return mergeData(instanceData, defaultData)
    // } else {
    //   return defaultData
    // }
  }
}

// 默认合并策略
const defaultStrategy = function (parentVal: any, childVal: any):any {
  return childVal === undefined ? parentVal : childVal
}

// data 选项合并策略
strategy.data = function (parentVal:any, childVal:any, vm?: Component) {
  if (!vm) {
    // console.log('子组件mergeOptions来到这里')
  }
  const args = arguments as unknown as [any, any, Component]
  return mergeDataOrFn(...args)
}

strategy.computed = function (parentVal: any, childVal: any) {
  if (childVal) {
    // 校验 childVal 传入的是否是 object，仅在开发环境上进行校验
    !isPlainObject(childVal) && (() => console.warn('computed must be an Record<string,Function | {get:Function, set: Function,sync: boolean, [key: string] : any}'))()
  }
  if (!parentVal) return childVal
  const ret = Object.create(null)

  if (childVal && parentVal) {
    extend(ret, parentVal)
    extend(ret, childVal)
  }
  return ret
}

export function mergeOptions (
  parent: Record<string, any>,
  child: Record<string, any>,
  vm?:Component
): ComponentOptions {
  const options:ComponentOptions = {} as any
  let key
  for (key in parent) {
    mergeField(key)
  }

  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }

  function mergeField (key:any) {
    const strat = strategy[key] || defaultStrategy
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
