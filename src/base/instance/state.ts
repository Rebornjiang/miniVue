import { GlobalAPI } from '@type/global-api'
export function stateMixin (Vue:GlobalAPI) {
  // 曝露出 $data ，给其作一层代理, 代理 vm._data
  const dataDef = {
    get () {
      return this._data
    },
    set () {
      alert('请勿更改实例原型上的 $data')
    }
  }

  Object.defineProperty(Vue.prototype, '$data', dataDef)
}
