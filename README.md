# 需求：
**目标：实现基础渲染，能够将定义在 data 中的数据给渲染出来**
1. 实现 vue 构造函数，给构造函数添加满足目标的能力
2. 实现 compiler 模块：实现 parse 方法，generate 方法等其他
3. 实现 vnode 模块：render 帮助方法，patch 函数等其他
4. 以上内容在实现过程中所设计的其他方法存储在 common 模块
**以上模块的内容均为实现目标来做，不会有多余额外的代码**
# 核心模块实现

**详细内容参考脑图**
- base
- compiler
- vnode
# 总结
整个 base 模块就像是桥梁连接者 compiler 与 vnode 模块，具体流程如下：
_init 方法用于创建 vue 实例 -> $mount 方法负责调用 compiler 将模板转换为 render Function （不考虑用户自定义render的情况） -> mountComponent 来调用 render Function 并将得到的 VDom 给到 patch 函数 -> 最后由 patch 函数根据 VDom 生成真实的 Dom 并挂载到页面上

# 脑图
[当前模块实现脑图](https://www.yuque.com/docs/share/93100e6c-e85d-4bcb-a452-42ff97cab352?# )《1. For-baseRender》