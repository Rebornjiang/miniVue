import type { ASTEvents, EventHanlder } from '@type/compiler'

export function genHandlers (handlers: ASTEvents, isNative: boolean):string {
  let ret = ''
  // let dynamicHanlders, staticHanlders
  ret = isNative ? 'nativeOn:' : 'on:'
  for (const name in handlers) {
    const handler = handlers[name]
    const code = genHandler(handler)
    console.log(code)
  }
  return ret
}

function genHandler (handlers:EventHanlder| EventHanlder[]) {

}
