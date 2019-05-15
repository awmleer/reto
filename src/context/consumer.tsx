import * as React from 'react'
import {ConstructorType, Store} from '../store'
import {FC, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {contextSymbol} from '../metadata-symbols'

interface Props<T extends Store> {
  of: ConstructorType<T>
  children: (store: T)=>ReactNode
}

export const Consumer: FC = function Consumer<T extends Store>(props: Props<T>) {
  const store = useStore(props.of)
  return this.props.children(store)
}

export function useStore<T extends Store<any>>(B: ConstructorType<T>): T {
  const Context = Reflect.getMetadata(contextSymbol, B)
  const store = React.useContext(Context) as T
  const [, setSymbol] = useState<Symbol>(Symbol())
  const storeRef = useRef<Store>(null)
  const callback = useCallback(() => {
    setSymbol(Symbol())
  }, [])

  if (storeRef.current !== store) {
    store.subscribers.push(callback)
    storeRef.current = store
  }
  useLayoutEffect(() => {
    return function() {
      store.subscribers.splice(store.subscribers.indexOf(callback), 1)
    }
  }, [store])
  return store
}
