import type{ CompilerOptions, CompiledResult } from '@type/compiler'
import baseOptions from './base-options/'
import { createCompileToFunctions } from './to-function'
import { generate } from './gencode'
import { parse } from './parse'
// const baseOptions = _baseOptions as CompilerOptions

// compiler
function baseCompile (template: string, options:CompilerOptions):CompiledResult {
  const ast = parse(template, options)

  // 先省略 optimizer

  const code = generate(ast, options)

  return { render: code.render, ast }
}

// baseOptions 与 用户传入的 options 合并，调用 baseCompile 进行编译
function compile (template: string, options: CompilerOptions):CompiledResult {
  const finalOptions = Object.create(baseOptions)
  if (options) {
    // console.log(finalOptions, 'finnaly')
  }

  const compiled = baseCompile(template.trim(), finalOptions)

  return compiled
}

export function createCompiler () {
  return { compile, compileToFunctions: createCompileToFunctions(compile) }
}

// type
export type Compile = typeof compile
