import { cached } from '@/common/utils'
import type{ ASTAttr, ASTElement, ASTNode, ASTText, CompilerOptions } from '@type/compiler'
import he from 'he'
import { parseHTML } from './html-parser'
import { parseText } from './text-parser'
export type parseHTMLOptions = {
  shouldKeepComment: boolean,
  start(tag:string, attrs:any[], unary:boolean, start: number, end:number):void
  isUnaryTag?: (tag:string) => boolean | undefined
  end(tag:string, start: number, end: number):void
  chars(text: string, start?: number, end?: number):void
  comment(text: string, start: number, end: number):void

  [key:string]: any
}

const decodeHTMLCached = cached(he.decode)
export function parse (template: string, options: CompilerOptions):ASTElement {
  // 解析 options
  const preserveWhitespace = options.preserveWhitespace !== false

  let root:ASTElement
  const stack:ASTElement[] = []
  let currentParent:ASTElement
  function closeElement (element: ASTElement) {
    element = processElement(element, options)

    if (!stack.length && root !== element) {
      console.error(
        'Component template should contain exactly one root element. ' +
        'If you are using v-if on multiple elements, ' +
         'use v-else-if to chain them instead.'
      )
    }

    if (currentParent && !element.forbidden) {
      currentParent.children.push(element)
      element.parent = currentParent
    }
  }

  const parseHTMLOptions:parseHTMLOptions = {
    shouldKeepComment: true,
    isUnaryTag: options.isUnaryTag,
    start (tag, attrs, unary, start, end) {
      const element = createASTElement(tag, attrs, currentParent)

      if (isForbiddenTag(element)) {
        element.forbidden = true
        console.warn('不允许在 template 中使用 script、 style  标签')
      }

      if (!root) root = element

      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        closeElement(element)
      }
    },
    end (tag, start, end) {
      const element = stack[stack.length - 1]
      stack.length -= 1
      currentParent = stack[stack.length - 1]
      closeElement(element)
    },
    chars (text, start, end) {
      const children = currentParent.children
      let finalText
      if (text.trim()) {
        // 调用 he lib 对 文本内容进行解码
        finalText = decodeHTMLCached(text)
      } else if (!children.length) {
        // 处理当前标签的到第一个子节点的这个换行符，不需要进行保留空白换行符
        finalText = ''
      } else if (preserveWhitespace) {
        finalText = ' '
      }

      if (finalText) {
        // let rest
        let child:ASTNode | undefined
        // 处理插值表达式
        const res = parseText(text)
        if (res) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          }
        } else {
          // 处理纯文本
          child = {
            type: 3,
            text
          }
        }
        if (child) children.push(child)
      }
    },
    comment (text, start, end) {
      // 注释节点也只能添加到 root 节点之内
      if (currentParent) {
        const child:ASTText = {
          isComment: true,
          type: 3,
          text
        }

        currentParent.children.push(child)
      }
    }
  }
  parseHTML(template, parseHTMLOptions)
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

export function processElement (element: ASTElement, options: CompilerOptions) {
  // 目前所有 vue 语法暂不实现，仅渲染
  return element
}

function isForbiddenTag (el:ASTElement):boolean {
  return (el.tag === 'style') || (el.tag === 'script' && ((!el.attrsMap.type) || (el.attrsMap.type as string) === 'text/javascript'))
}
