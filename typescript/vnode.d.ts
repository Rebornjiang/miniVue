import vn from '@/vnode/vnode'
export type VNode = vn

// vnode 内容(子节点)
export declare type VNodeChildren = Array<null | string | VNode | VNodeChildren> | string

export declare interface VNodeData {
  [key:string]: any
}
