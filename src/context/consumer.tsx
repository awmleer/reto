import * as React from 'react'
import {FC, ReactNode, useContext} from 'react'
import {contextSymbol} from '../metadata-symbols'

interface Props<T> {
  of: () => T
  children: (store: T)=>ReactNode
}

export const Consumer: FC = function Consumer<T>(props: Props<T>) {
  const store = useStore(props.of)
  return this.props.children(store)
}

export function useStore<T>(S: () => T) {
  const Context = Reflect.getMetadata(contextSymbol, S)
  return useContext(Context) as T
}
