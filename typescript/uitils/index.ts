export type TupleToUnion<T extends any[], U = any> = T extends Array<infer P> ? P extends U ? P: never:never
