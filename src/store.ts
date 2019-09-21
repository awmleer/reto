import {Context, default as React} from 'react'
import {Container} from './container'

export interface Store<T> {
  (...args: unknown[]): T
  defaultValue?: T
  optional?: boolean
  displayName?: string
  // defaultProps?
  
  Context?: Context<Container<T>>
}

export function getStoreContext<T>(S: Store<T>): Store<T>['Context'] {
  if (!S.Context) {
    S.Context = React.createContext(new Container<T>(S.defaultValue))
  }
  return S.Context
}
