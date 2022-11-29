import { noop } from '@/common/utils'
import { Component } from '@type/vue'
import { Dep, popTarget, pushTarget } from './dep'
import { unicodeRegExp } from '@/compiler/parse/html-parser'
import { traverse } from './traverse'
let uid = 0
export class Watcher {
  id: number
  depIds: number[] = []
  deps: Dep[] = []
  newDepIds:number[] = []
  newDeps:Dep[] = []
  getter:any

  lazy?: boolean
  vm?: Component
  dirty?:boolean
  user?:boolean
  deep?:boolean
  cb?:Function
  active: boolean

  value:any
  constructor (vm:Component, expOrFn: string | Function, cb:Function, options:any, isRender?:boolean) {
    this.id = ++uid

    if (vm) {
      this.vm = vm
      if (isRender) {
        vm._watcher = this
      }
      vm._watchers.push(this)
    }

    if (options) {
      this.lazy = !!options.lazy
      this.user = !!options.user
      this.deep = !!options.deep
    }
    this.cb = cb
    this.active = true
    this.dirty = this.lazy

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parseKeyPath(expOrFn)
    }
    this.lazy ? noop() : this.get()
  }

  get () {
    pushTarget(this)
    const vm = this.vm
    let value
    try {
      value = this.getter.call(vm, vm)
    } catch (error) {
      console.warn('watcher getter 出错哦')
    } finally {
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanDepend()
    }
    return value
  }

  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  depend () {
    let length = this.deps.length
    while (length--) {
      this.deps[length].depend()
    }
  }

  addDep (dep:Dep) {
    if (!this.newDepIds.includes(dep.id)) {
      this.newDepIds.push(dep.id)
      this.newDeps.push(dep)

      if (!this.depIds.includes(dep.id)) {
        dep.add(this)
      }
    }
  }

  cleanDepend () {
    for (let i = 0, len = this.depIds.length; i < len; i++) {
      if (!this.newDepIds.includes(this.depIds[i])) {
        this.deps[i].remove(this)
      }
    }

    this.deps = this.newDeps
    this.depIds = this.newDepIds

    this.newDeps = []
    this.newDepIds = []
  }

  update () {
    // 加入渲染队列中
  }

  teardown () {
    if (this.active) {
      // 取消当前 vm._watchers 存在的 watcher

      // 取消当前watcher 与 对应Dep之间的依赖关系
      this.deps.forEach(dep => {
        dep.remove(this)
      })
    }
    this.active = false
  }
}

const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
function parseKeyPath (path: string):any {
  if (bailRE.test(path)) return
  const segments = path.split('.')
  return function collectDep () {
    const vm:Component = this
    let obj:any = vm
    for (let i = 0, len = segments.length ?? 0; i < len; i++) {
      if (!obj) return
      // 依赖收集
      obj = obj[segments[i]]
    }
    return obj
  }
}
