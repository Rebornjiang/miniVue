import { vueLifecycleHooks } from './hook'
import { VNode } from './vnode'

type plainObj<T = any> = {[key: string | number | symbol] :T}

// 初始化传入的 vue 选项
interface vueBaseOptions {
  data: plainObj | (() => plainObj)
  methods: plainObj<Function>
}

export type constructorOptions = vueLifecycleHooks & {[key: string]: any} & vueBaseOptions

export declare class Vue {
  constructor(options?:any)

  static cid:number

  // Function
  _init(options: constructorOptions):void
  _render():VNode
  _update(vnode: VNode):void
}
