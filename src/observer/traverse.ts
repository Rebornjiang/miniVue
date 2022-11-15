import { isArray, isPlainObject } from '@/common/utils'
import VNode from '@/vnode/vnode'

export function traverse (val:any, has = new Set()):any {
  if ((!isArray(val) && !isPlainObject<any>(val)) || val instanceof VNode || Object.isFrozen(val)) return undefined

  if (val.__ob__) {
    const depId = val?.__ob__?.dep?.id
    if (has.has(depId)) return

    has.add(depId)
  }

  if (isArray(val)) {
    for (let i = 0, len = val.length; i < len; i++) {
      traverse(val[i], has)
    }
  } else {
    const obj = val as any
    const keys = Object.keys(obj)
    for (const key in keys) {
      traverse(obj[key], has)
    }
  }
}
