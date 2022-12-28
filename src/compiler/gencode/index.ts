import type{ ASTElement, ASTExpression, ASTNode, ASTText, CompilerOptions } from '@type/compiler'
import { genHandlers } from './genHandler'

type DataGenFunction = (el:ASTElement) => string
export class CodegenState {
  dataGenFns: DataGenFunction[]
  constructor (options: CompilerOptions) {
    this.dataGenFns = []
  }
}

export type CodegenResult = {
  render: string
}
export function generate (ast: ASTElement | void, options: CompilerOptions):CodegenResult {
  const state = new CodegenState(options)

  const code = ast ? ast.tag === 'script' ? 'null' : genElement(ast, state) : '_c("div")'

  return {
    render: `with(this){return ${code}}`
  }
}

function genElement (el: ASTElement, state:CodegenState):string {
  const data = genData(el, state)
  const children = genChildren(el, state)
  const code = `_c('${el.tag}'${data ? ',' + data : ''}${children ? `,${children}` : ''})`
  console.log(code)
  return code
}

export function genData (el:ASTElement, state:CodegenState):string {
  let data = '{'
  if (el.events) {
    data += genHandlers(el.events, false)
  } else if (el.nativeEvents) {
    data += genHandlers(el.nativeEvents, true)
  }
  data += '}'
  return data
}

export function genChildren (el: ASTElement, state: CodegenState) {
  const children = el.children
  if (children.length) {
    const gen = genNode

    return `[${children.map(c => gen(c, state)).join(',')}]`
  }
}

export function genNode (node:ASTNode, state: CodegenState):string {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

export function genText (text: ASTText | ASTExpression):string {
  return `_v(${text.type === 2 ? text.expression : transformSpecialNewLines(JSON.stringify(text.text))})`
}

export function genComment (comment: ASTText):string {
  return `_e(${JSON.stringify(comment.text)})`
}

// 字符串 '\u2028' 中 \ 会被当成转义符，因此需要在此转义
// \u2028 \u2029 为行分隔符 & 段落分隔符
function transformSpecialNewLines (text: string) {
  return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}
