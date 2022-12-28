import vn from '@/vnode/vnode'
export type VNode = vn

// vnode 内容(子节点)
export declare type VNodeChildren = Array<null | string | VNode | VNodeChildren> | string

export declare type MoludeType = {
  create?: Function
  update?: Function
}
export declare interface VNodeData {
  on?: Record<string, any>
  navOn?:Record<string, any>
  hooks?: MoludeType
  [key:string]: any
}
