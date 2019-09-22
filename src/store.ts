import {Context, default as React} from 'react'
import {Container} from './container'

export interface Store<F extends (...args: any) => any = (...args: any) => any> {
  (...args: Parameters<F>): ReturnType<F>
  defaultValue?: ReturnType<F>
  optional?: boolean
  displayName?: string
  // defaultProps?
  
  Context?: Context<Container<Store<F>>>
}

export function getStoreContext<F extends (...args: any) => any>(S: Store<F>): Store<F>['Context'] {
  if (!S.Context) {
    S.Context = React.createContext<Container<Store<F>>>(new Container<Store<F>>(S.defaultValue))
  }
  return S.Context
}
