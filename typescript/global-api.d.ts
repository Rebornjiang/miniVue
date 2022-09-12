import type{ VueCtorPrototype } from '@type/uitils/extract'
import type{ Component } from '@type/vue'

// for Vue prototype
type extraProps = {
  $data: Record<string, any>
  $mount: Component['$mount']
}

// GlobalAPI 将会被指定为 Vue 构造函数的类型
export interface GlobalAPI {
  new (options: any):Component // 给 Vue 添加构造签名，否则通过 new 调用会报错
  cid: number;

  // 这个 $data 也是原型上的属性
  prototype: VueCtorPrototype & extraProps;
  // 允许扩展其他类型
  [key: string]: any;
}
