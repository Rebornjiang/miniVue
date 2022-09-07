
import type { GlobalAPI } from '@type/global-api'
import { initMixin } from './init'
// @ts-ignore
function Vue (options:any) {
  if (new.target !== Vue) throw new Error('Vue 必须使用 new 来调用')
  this._init(options)
}

// @ts-expect-error Vue has function type
initMixin(Vue)

export default Vue as unknown as GlobalAPI
