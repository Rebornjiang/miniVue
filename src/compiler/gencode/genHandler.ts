import { isArray } from '@/common/utils'
import type { ASTEvents, EventHanlder } from '@type/compiler'

const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/
const fnInvokeRE = /\([^)]*?\);*$/
const simplePathRE =
  /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/

export function genHandlers (events: ASTEvents, isNative: boolean):string {
  const prefix = isNative ? 'nativeOn:' : 'on:'
  let dynamicHanlders = ''
  let staticHanlders = ''
  for (const name in events) {
    const handlers = events[name]
    const handler = genHandler(handlers)
    const curHanlder:EventHanlder | EventHanlder[] = events[<keyof typeof handlers>name]
    // @ts-ignoret 不允许动态绑定的事件名拥有多个 handler
    if (curHanlder && curHanlder.dynamic) {
      dynamicHanlders += `${name},${handler}`
    } else {
      staticHanlders += `${name}:${handler}},`
    }
  }
  staticHanlders = `{${staticHanlders.slice(0, -1)}}`
  if (dynamicHanlders) {
    dynamicHanlders = dynamicHanlders.slice(0, -1)
    return prefix + `_d(${{}},[${dynamicHanlders}])`
  } else {
    return prefix + staticHanlders
  }
}
const modifierKeyToCode = {
  prevent: '$event.preventDefault()'
}

function genHandler (handlers:EventHanlder| EventHanlder[]):string {
  if (!handlers) return ''
  if (isArray(handlers)) {
    return `${[handlers.map(handler => genHandler(handler)).join(',')]}`
  }
  const { value, modifiers } = handlers
  const isMethodPath = simplePathRE.test(value) // method中的方法, 或是@click = "obj.fn" || @click="fnInMethod"
  const isFunctionExpression = fnExpRE.test(value) // 函数表达式: @click = "() => {}"
  const isFunctionInvocation = simplePathRE.test(
    value.replace(fnInvokeRE, '')
  )
  if (!modifiers) {
    if (isMethodPath || isFunctionExpression) return value

    return `function($event) {
      ${isFunctionInvocation ? `return ${value}` : `${value}`}
    }`
  } else {
    let modifierCode = ''
    let code = ''
    // 处理事件修饰符
    const modifiersKeys:(keyof typeof modifiers)[] = Object.keys(modifiers)

    for (const modifier in modifiersKeys) {
      if (modifier in modifierKeyToCode) {
        modifierCode += `${modifierKeyToCode[<keyof typeof modifierKeyToCode>modifier]};`
      } else if (modifier === 'exact') {
        // 暂不处理 exact 的情况

      } else {
        // 暂不处理事件修饰符按键
      }
    }

    if (isMethodPath) {
      code = `function($event) { ${modifierCode} ${value}.apply(null,arguments)}`
    } else if (isFunctionExpression) {
      code = `function($event) { ${modifierCode} (${value}).apply(null,arguments)}`
    } else {
      code = `function($event) {${modifierCode} ${isFunctionInvocation ? `return ${value}` : `${value}`}}`
    }
    return code
  }
}
