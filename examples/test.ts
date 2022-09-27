import Vue from '../src/main'

const vm = new Vue({
  data: {
    msg: 'hello world',
    content: 'this is content',
    children: {
      sonMsg: 'son MSG'
    }
  },
  methods: {
    testFn1 () {},
    testFn2 () {}
  }
})
vm.$mount('#app')
