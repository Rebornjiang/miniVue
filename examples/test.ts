import Vue from '../src/main'

const vm = new Vue({
  data: {
    firstName: 'reborn',
    lastName: 'jiang',
    count: 5,
    info: {
      name: 'reborn',
      age: 18,
      tall: 180
    }
  },
  computed: {
    fullName () {
      return this.firstName + this.lastName
    }
  },
  watch: {
    info: {
      handler (newVal:any, oldVal:any) {
        console.log('watch cb executed!')
      },
      deep: true
    }
  }
})
console.log(vm)
vm.$mount('#app')
