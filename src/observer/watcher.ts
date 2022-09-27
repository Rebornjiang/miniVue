import { Dep, popTarget, pushTarget } from './dep'
let watcherId = 0
export class Watcher {
  id: number
  depIds: number[] = []
  deps: Dep[] = []
  newDepIds:number[] = []
  newDeps:Dep[] = []
  getter:any

  constructor (fn: Function) {
    this.id = ++watcherId

    this.getter = fn

    this.get()
  }

  get () {
    pushTarget(this)
    try {
      const value = this.getter()
      console.log(value)
    } catch (error) {
      console.warn('watcher getter 出错哦')
    } finally {
      popTarget()
      this.cleanDepend()
    }
  }

  addDep (dep:Dep) {
    if (!this.newDepIds.includes(dep.id)) {
      this.newDepIds.push(dep.id)
      this.newDeps.push(dep)

      if (!this.depIds.includes(dep.id)) {
        dep.add(this)
      }
    }
  }

  cleanDepend () {
    for (let i = 0, len = this.depIds.length; i < len; i++) {
      if (!this.newDepIds.includes(this.depIds[i])) {
        this.deps[i].remove(this)
      }
    }

    this.deps = this.newDeps
    this.depIds = this.newDepIds
  }

  update () {
    // 加入渲染队列中
  }
}
