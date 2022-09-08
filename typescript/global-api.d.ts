import { VueCtorPrototype } from '@type/uitils/extract'

// GlobalAPI 将会被指定为 Vue 构造函数的类型
export interface GlobalAPI {
  cid: number;

  // 这个 $data 也是原型上的方法
  prototype: VueCtorPrototype & { $data: Record<string, any> };
  // 允许扩展其他类型
  [key: string]: any;
}
