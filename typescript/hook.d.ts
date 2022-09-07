// vue 生命周期钩子函数
export interface vueLifecycleHooks {
  beforeCreate: () => void
  created: () => void
  beforeMount: () => void
  mounted: () => void

  beforeUpdate:() => void
  updated: () => void

  beforeDestory: () => void
  destoryed: () => void
}

// vnodeHooks
