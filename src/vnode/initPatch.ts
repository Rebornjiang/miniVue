// 初始化 vnode 用到的 DOM 操作，模块能力，用于初始化 patch 方法
import { createPatchFunction } from './patch'
import * as nodeOps from '@/vnode/helpers/node-ops'
const patch = createPatchFunction({ nodeOps, modules: {} })
export default patch
