import { Component } from '@type/vue'
import { makeMap } from '@/common/utils'

const isHaveProxy = Proxy && /native code/.test(Proxy.toString())

const allowedGlobals = makeMap(
  'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,' +
    'require' // for Webpack/Browserify
)

const handler:ProxyHandler<Component> = {
  has (target, key) {
    const has = key in target
    // isAllowed 是指支持 windows 成员 || render-helpers 中定义的方法
    const isAllowed = typeof key === 'string' ? (allowedGlobals(key) || (key.charAt(0) === '_' && !(key in target.$data))) : false

    if (!has && !isAllowed) {
      if (key in target.$data) {
        // data: {_msg: 'hello world'} options data这样定义不会被代理到 vm 上
        console.warn('data: {_msg: \'hello world\'} options data这样定义不会被代理到 vm 上')
      } else {
        // template 中使用的变量不存在
        console.warn('模板中使用的变量不存在')
      }
    }
    // !isAllowed 对于使用全局成员，has 必须返回false，不然全局成员只会在 vm 实例上查找，不会沿着作用域链条进行查找
    return has || !isAllowed
  }
}

export const initProxy = (vm:Component) => {
  if (isHaveProxy) {
    vm._renderProxy = new Proxy(vm, handler)
  } else {
    vm._renderProxy = vm
  }
}
