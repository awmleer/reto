import {Context, default as React} from 'react'
import {Container} from './container'

export interface Store<T = unknown, P = {}> {
  (params: P): T
  defaultValue?: T
  optional?: boolean
  displayName?: string
  memo?: boolean | ((prevParams: P, nextParams: P) => boolean)
  // defaultProps?
  
  Context?: Context<Container<T>>
}

export type StoreParams<S extends Store> = S extends Store<any, infer P> ? P : never
export type StoreValue<S extends Store> = S extends Store<infer T, any> ? T : never

export function getStoreContext<T>(S: Store<T>): Store<T>['Context'] {
  if (!S.Context) {
    S.Context = React.createContext(new Container<T>(S.defaultValue))
  }
  return S.Context
}
