import type{ CompilerOptions } from '@type/compiler'
import { isUnaryTag, isNonPhrasingTag, canBeLeftOpenTag } from './utils'

// 编译需要的 baseOptions 选项
const baseOptions = {
  expectHTML: true,
  isUnaryTag,
  isNonPhrasingTag,
  canBeLeftOpenTag
} as CompilerOptions
export default baseOptions
