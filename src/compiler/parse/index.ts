import type{ ASTElement, CompilerOptions } from '@type/compiler'
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
  // let root:ASTElement
  // const stack:ASTElement[] = []
  // let currentParent:ASTElement
  const parseHTMLOptions:parseHTMLOptions = {
    shouldKeepComment: true,
    isUnaryTag: options.isUnaryTag,
    start (tag, attrs, unary, start, end) {
      console.log({ tag, attrs, unary, start, end })
    },
    end (tag, start, end) {

    },
    chars (text, start, end) {

    },
    comment (text, start, end) {

    }
  }
  parseHTML(template, parseHTMLOptions)
  return {} as ASTElement
}
