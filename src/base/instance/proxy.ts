import { Component } from '@type/vue'

const isHaveProxy = Proxy && /native code/.test(Proxy.toString())

export const initProxy = (vm:Component) => {
  if (isHaveProxy) {
    vm._renderProxy = new Proxy(vm, {})
  } else {
    vm._renderProxy = vm
  }
}
