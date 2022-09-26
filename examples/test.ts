import Vue from '../src/main'

const vm = new Vue({
  data: {
    _msg: 'dsfdsf',
    header: 'zhelishiheader'
  },
  render (h:any) {
    return h('div', { attrs: { id: '#app' } }, [
      'textContent',
      ['nested-1-content', 'nested-1-content'],
      h('h2', 'h1Element'),
      ['nested-1-content', [h('strong', '2323'), 'nested-2-content']]

    ])
  }
})

vm.$mount('#app')
