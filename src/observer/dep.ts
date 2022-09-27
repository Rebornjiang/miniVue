import type{ Watcher } from './watcher'

let depId:number = 0
const watcherStack:any[] = []
export class Dep {
  static target: Watcher | null | undefined

  id:number
  subs: Watcher[] = []
  constructor () {
    this.id = ++depId
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  add (watcher: Watcher) {
    this.subs.push(watcher)
  }

  remove (watcher:Watcher) {
    const idx = this.subs.findIndex(sub => sub === watcher)
    if (idx) this.subs.splice(idx, 1)
  }

  notify () {
    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i].update()
    }
  }

  removeAll () {
    this.subs = []
  }
}

Dep.target = null

export function pushTarget (target: any) {
  watcherStack.push(target)
  Dep.target = watcherStack[watcherStack.length - 1]
}

export function popTarget () {
  if (watcherStack.length < 1) return
  Dep.target = watcherStack.pop()
}
