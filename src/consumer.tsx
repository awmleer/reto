import * as React from 'react'
import {ReactNode, useContext, useDebugValue, useEffect, useState} from 'react'
import {ReactElement} from 'react'
import {Container} from './container'
import {Store} from './store'
import {contextSymbol} from './symbols'

interface Props<T> {
  of: Store<T>
  children: (store: T) => ReactNode
}

export function Consumer<T>(props: Props<T>) {
  const store = useStore(props.of)
  return props.children(store) as ReactElement
}

export function useStore<T>(S: Store<T>, optional?: boolean) {
  const Context = Reflect.getMetadata(contextSymbol, S)
  if (!Context) {
    if (!optional) {
      console.error(`No store context of "${S.name}" found. Did you provide it?`)
    }
    return
  }
  useDebugValue(S.name)
  const container = useContext(Context) as Container<T>
  
  const [state, setState] = useState<T>(container.store)
  
  useEffect(() => {
    const subscriber = () => {
      setState(container.store)
    }
    container.subscribers.add(subscriber)
    return () => {
      container.subscribers.delete(subscriber)
    }
  }, [])
  
  return state
}
