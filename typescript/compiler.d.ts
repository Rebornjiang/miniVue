/* eslint-disable no-use-before-define */

declare type ASTAttr = {
  name: string
  value: any
  dynamic?: boolean
  start?: number
  end?:number
}

declare type ASTElement = {
  type: 1
  tag: string
  attrsList: ASTAttr[]
  attrsMap: Record<string, ASTAttr>
  parent: ASTElement | void
  children: ASTNode[]

  start?: number
  end?: number
}

declare type ASTExpression = {
  type: 2
  expression: string
  text: string
}

declare type ASTText = {
  type: 3
  text: string
  static?: boolean
  isComment?: boolean
  start?: number
  end?: number
}

declare type ASTNode = ASTElement | ASTText | ASTExpression

export declare interface CompiledResult {
  ast: ASTElement | null
  render: string
}

export declare interface CompilerOptions {

  // 用户设置
  comments?: boolean // 是否保留注释节点

}
