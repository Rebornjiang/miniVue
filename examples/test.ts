import Vue from '../src/main'

const vm = new Vue({
  data: {
    firstName: 'reborn',
    lastName: 'jiang',
    count: 5,
    nocacheVal: 5
  },
  computed: {
    fullName () {
      return this.firstName + this.lastName
    },
    square: {
      get () {
        return this.count * this.count
      },
      set (val:any) {
        this.count = val
      }
    },
    cube: {
      get () {
        return this.nocacheVal * this.nocacheVal * this.nocacheVal
      },
      set (val: any) {
        this.nocacheVal = val
      },
      cache: false
    }
  }
})
vm.$mount('#app')
