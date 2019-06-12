import * as React from 'react'
import {FC, ReactNode, useContext} from 'react'
import {contextSymbol} from './metadata-symbols'
import {Store} from './store'

interface Props<T> {
  of: Store<T>
  children: (store: T)=>ReactNode
}

export const Consumer: FC = function Consumer<T>(props: Props<T>) {
  const store = useStore(props.of)
  return this.props.children(store)
}

export function useStore<T>(S: Store<T>) {
  const Context = Reflect.getMetadata(contextSymbol, S)
  if (!Context) {
    console.error(`No store context of "${S.name}" found. Did you provide it?`)
    return null
  }
  return useContext(Context) as T
}
