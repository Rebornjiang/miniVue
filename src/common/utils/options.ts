import type { Component } from '@type/vue'
import type { ComponentOptions } from '@type/options'
import { hasOwn } from './utils'

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
