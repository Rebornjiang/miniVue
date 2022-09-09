// 初始化 vnode 用到的 DOM 操作，模块能力，用于初始化 patch 方法
import { createPatchFunction } from './patch'
const patch = createPatchFunction({ domApi: {}, modules: {} })
export default patch
