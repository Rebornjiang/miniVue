import { isArray, isDef, isFalse, isPrimitive } from '@/common/utils'
import VNode, { createTextVNode } from '../vnode'

export function normalizeChildren (children:any):VNode[] | undefined {
  return isPrimitive(children) ? [createTextVNode(children)] : isArray(children) ? normalizeArrayChildren(children) : undefined
}
const isTextNode = (node: any):boolean => isDef(node) && isDef(node.text) && isFalse(node.isComment)
export function normalizeArrayChildren (children: any[]):VNode[] {
  // 用户定义的 render 函数，chidlren 支持规则如下：
  const res:VNode[] = []
  let i, c, lastIdx, last
  for (i = 0; i < children.length; i++) {
    c = children[i]
    lastIdx = res.length - 1
    last = res[lastIdx]

    if (isPrimitive(c)) {
      if (isTextNode(last)) {
        res[lastIdx] = createTextVNode(last.text + c)
      } else if (c !== '') {
        res.push(createTextVNode(c))
      }
    } else if (isArray(c)) {
      // children =  [[item, item], item], c = [item, item]
      if (c.length > 0) {
        c = normalizeArrayChildren(c)

        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIdx] = createTextVNode(<string>last.text + <string>c[0].text)
          c.shift()
        }
        res.push.apply(res, c)
      }
    } else {
      // c = textVNode || other
      if (isTextNode(c) && isTextNode(last)) {
        res[lastIdx] = createTextVNode(last.text + c.text)
      } else {
        // c = elmVNode
        res.push(c)
      }
    }
  }
  return res
}
