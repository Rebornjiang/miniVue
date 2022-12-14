import { VNodeData } from '@type/vnode'

export default class VNode {
  tag?: string
  text?: string
  elm: Node | undefined // 一个 vnode 对象必须有 elm 元素， so 没有使用 ？ 定义 elm
  // key: string | number | undefined
  // eslint-disable-next-line no-use-before-define
  children?: VNode[] | null
  data?: VNodeData

  isComment?: boolean

  constructor (tag?: string, data?: VNodeData, children?: VNode[] | null, text?:string, elm?:Node) {
    this.tag = tag
    this.children = children
    this.text = text
    this.data = data
    this.elm = elm
    this.isComment = false
  }
}

// 用于快速创建一个 文本 vnode
export const createTextVNode = (text: string | number) => {
  return new VNode(undefined, undefined, undefined, String(text))
}

export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
