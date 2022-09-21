import Vue from '../src/main'

const vm = new Vue({
  el: '#app',
  data: {
    msg: 'hello My Mini Vue'
  }
})

console.log(vm, 'vm')
