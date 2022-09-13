import { ASTElement, CompilerOptions } from '@type/compiler'

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

function genElement (ast: ASTElement, state:CodegenState):string {
  return ''
}
