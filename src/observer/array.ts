import { def } from '@/common/utils'
import type { ExtractAllFnFromInterface, RemoveIdxSign } from '@type/uitils/extract'
import type { Observer } from './index'
type ArrayMethods = ExtractAllFnFromInterface<RemoveIdxSign<Array<any>>>
const arrPrototype = Array.prototype as ArrayMethods

export const arrayMethods = Object.create(Array.prototype)

const reSetMethods: Array<'splice' | 'pop' | 'shift' | 'unshift' | 'push' | 'sort' | 'reverse' | 'copyWithin' | 'fill'> = [
  'splice',
  'pop',
  'shift',
  'unshift',
  'push',
  'sort',
  'reverse',
  'copyWithin',
  'fill'
]

reSetMethods.forEach(function resetArr (method) {
  const origin = arrPrototype[method]

  def(arrayMethods, method, function resetFn (...args: any[]) {
    const results = origin.apply(this, args)
    const ob = <Observer | undefined> this?.__ob__
    // 检查插入的值
    let insertVal

    switch (method) {
      case 'fill':
        insertVal = args[0]
        break
      case 'push':
      case 'unshift':
        insertVal = args
        break
      case 'splice':
        insertVal = args.slice(2)
        break
    }

    if (insertVal) ob?.obserArray(insertVal)

    if (ob) ob.dep.notify()
    return results
  })
})
