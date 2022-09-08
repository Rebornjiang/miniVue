
import type { GlobalAPI } from '@type/global-api'
import { initMixin } from './init'
import { renderMixin } from './render'
import { stateMixin } from './state'

function Vue (options:any) {
  if (new.target !== Vue) throw new Error('Vue 必须使用 new 来调用')
  this._init(options)
}

initMixin(Vue as unknown as GlobalAPI)

renderMixin(Vue as unknown as GlobalAPI)

stateMixin(Vue as unknown as GlobalAPI)

export default Vue as unknown as GlobalAPI
