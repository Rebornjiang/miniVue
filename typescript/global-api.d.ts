import type{ VueCtorPrototype } from '@type/uitils/extract'
import type{ Component } from '@type/vue'

// for Vue prototype
type extraProps = {
  $data: Record<string, any>
  $mount: Component['$mount']
}

// GlobalAPI 将会被指定为 Vue 构造函数的类型
export interface GlobalAPI {
  cid: number;

  // 这个 $data 也是原型上的属性
  prototype: VueCtorPrototype & extraProps;
  // 允许扩展其他类型
  [key: string]: any;
}
