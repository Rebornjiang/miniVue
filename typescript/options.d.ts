// declare type PropOptions  = {

import { VNode } from './vnode'

// }

export declare type ComponentOptions = {
  [key: string]:any

  data?: Object | Function

  methods?: {[key: string]: Function}

  el?: string | Element
  template?: string | Element
  render(h?:() => VNode) : VNode | void

  // lifecycle
  beforeCreate?: Function
  created?: Function
  beforeMount?:Function
  mounted?:Function
  beforeUpdate: Function
  updated: Function
  acticated?: Function
  deactivated?: Function
  beforeDestory?: Function
  destoryed?:Function

}
