import * as React from 'react'
import {ConstructorType, Store} from '../store'
import {FC, ReactNode, useEffect, useState} from 'react'
import {contextSymbol, injectsSymbol} from '../metadata-symbols'
import {InjectMark} from '../di'
import {useContext} from 'react'

interface Props<T extends Store> {
  of: ConstructorType<T>
  children: (store: T)=>ReactNode
}

export const Consumer: FC = function Consumer<T extends Store>(props: Props<T>) {
  const store = useStore(props.of)
  return this.props.children(store)
}

export function useStoreUpdate(store: Store) {
  const [, setSymbol] = useState<Symbol>(Symbol())
  useEffect(() => {
    function callback() {
      setSymbol(Symbol())
    }
    store.subscribers.push(callback)
    return function() {
      store.subscribers.splice(store.subscribers.indexOf(callback), 1)
    }
  }, [store])
}

export function useStore<T extends Store<any>>(B: ConstructorType<T>): T {
  const Context = Reflect.getMetadata(contextSymbol, B)
  const store = React.useContext(Context) as T
  useStoreUpdate(store)
  return store
}
