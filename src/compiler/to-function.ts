
import type { CompilerOptions } from '@type/compiler'
import { extend, noop } from '@/common/utils'
import type { Compile } from './create-compiler'
// 与生成 function 有关

import { Component } from '@type/vue'

// render string code convert render function

function createFunction (code:string) {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(code)
  } catch (error) {
    alert('当前环境不支持 new Function')
    return noop
  }
}

// convertCompileFunction
type CompiledFunctionResult = {
  render :Function
}

export function createCompileToFunctions (compile: Compile) {
  const cache:Record<string, CompiledFunctionResult> = Object.create(null)
  return function compileToFunctions (template: string,
    options?: CompilerOptions,
    vm?:Component):CompiledFunctionResult {
    options = extend({}, options)
    // check cache
    if (cache[template]) return cache[template]

    // 编译
    const compiled = compile(template, options)

    // 转换成函数
    const res = {} as CompiledFunctionResult
    res.render = createFunction(compiled.render)

    return res
  }
}
