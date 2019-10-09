import {Context, default as React} from 'react'
import {Container} from './container'

export interface Store<P extends unknown[] = any[], V = any> {
  (...args: P): V
  defaultValue?: V
  optional?: boolean
  displayName?: string
  // defaultProps?
  
  Context?: Context<Container<V>>
}

export type StoreP<S extends Store> = S extends Store<infer P, any> ? P : never
export type StoreV<S extends Store> = S extends Store<any, infer V> ? V : never

export function getStoreContext<S extends Store>(S: S) {
  if (!S.Context) {
    S.Context = React.createContext(new Container<StoreV<S>>(S.defaultValue))
  }
  return S.Context
}
