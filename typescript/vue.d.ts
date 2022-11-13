import { vueLifecycleHooks } from './hook'
import { VNode, VNodeChildren } from './vnode'
import { ComponentOptions } from './options'
import { Watcher } from '@/observer/watcher'

type plainObj<T = any> = {[key: string | number | symbol] :T}

// 初始化传入的 vue 选项
interface vueBaseOptions {
  data: plainObj | (() => plainObj)
  methods: plainObj<Function>
}

export type constructorOptions = vueLifecycleHooks & vueBaseOptions & {[key: string]: any}

// Component 为组件实例的类型
export declare class Component {
  constructor(options?:any)

  // 实例属性
  // public
  $el: string | Element
  $data: Record<string, any>
  $options: ComponentOptions
  $vnode: VNode

  // private
  _uid: number
  _data: Record<string, any>
  _isMounted: boolean
  _isVue: boolean
  _watcher: Watcher
  _watchers: Watcher[]
  _computedWatchers: Record<string, Watcher>
  // eslint-disable-next-line no-use-before-define
  _renderProxy: Component | ProxyConstructor

  // 原型上的方法
  // public

  // private
  _init(options: constructorOptions):void
  _render():VNode
  _update(vnode: VNode):void
  _patch(oldVnode: VNode | Element | null, vnode: VNode):Element

  // render-helper
  _v(text:string | number):VNode
  _c(tag:string, data?: Record<string, any>, children?:VNodeChildren, normalizationType?: any):VNode |VNode[]
  _s(val: any):string
  _e(text: string):VNode

  $mount(el: Element | string): Component
  $watch(expOrFn: string | Function, ...args:any):any
  $createElement(tag?: string, data?: Record<string, any>, children?:VNodeChildren, normalizationType?: any): VNode |VNode[]

  // eslint-disable-next-line no-undef
  [key:string]: any // 给 实例挂载 methods 中的方法
}

export type patchFn = Component['_patch']
