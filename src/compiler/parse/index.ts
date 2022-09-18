import type{ ASTAttr, ASTElement, ASTNode, CompilerOptions } from '@type/compiler'
import { parseHTML } from './html-parser'

export type parseHTMLOptions = {
  shouldKeepComment: boolean,
  start(tag:string, attrs:any[], unary:boolean, start: number, end:number):void
  isUnaryTag?: (tag:string) => boolean | undefined
  end(tag:string, start: number, end: number):void
  chars(text: string, start: number, end: number):void
  comment(text: string, start: number, end: number):void

  [key:string]: any
}

export function parse (template: string, options: CompilerOptions):ASTElement {
  let root:ASTElement
  const stack:ASTElement[] = []
  let currentParent:ASTElement
  const parseHTMLOptions:parseHTMLOptions = {
    shouldKeepComment: true,
    isUnaryTag: options.isUnaryTag,
    start (tag, attrs, unary, start, end) {
      console.log({ tag, attrs, unary, start, end })
      const element = createASTElement(tag, attrs, currentParent)

      if (!root) root = element

      if (!unary) {
        currentParent = element
        stack.push(element)
      }
    },
    end (tag, start, end) {

    },
    chars (text, start, end) {
      const children = currentParent.children
      if (text.trim()) {
        console.log({ text, currentParent }, 'tttttttttt')
        // let rest
        let child:ASTNode | undefined
        // if (res = parseText(tex))
        // 处理插值表达式
        if (start) {
          child = {
            type: 2,
            expression: '',
            text
          }
        }
        // 处理纯文本
        child = {
          type: 3,
          text
        }
        if (child) children.push(child)
      }
    },
    comment (text, start, end) {

    }
  }
  parseHTML(template, parseHTMLOptions)
  // @ts-ignore
  console.log({ root })
  // @ts-ignore
  return root
}

export function createASTElement (tag: string, attrs: ASTAttr[], parent: ASTElement | void):ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    children: [],
    parent,
    rawAttrsMap: {}
  }
}

function makeAttrsMap (attrs: ASTAttr[]) {
  const map:Record<string, string> = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    // 检测重复属性
    if (map[attrs[i].name]) console.warn('标签上存在重复属性')
    map[attrs[i].name] = attrs[i].value
  }
  return map
}
