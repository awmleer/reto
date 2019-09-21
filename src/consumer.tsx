import * as React from 'react'
import {ReactNode, useContext, useDebugValue, useEffect, useRef, useState} from 'react'
import {ReactElement} from 'react'
import {Container} from './container'
import {Store} from './store'
import {contextSymbol} from './symbols'

type Deps<T> = (store: T) => unknown[]

interface Props<T> {
  of: Store<T>
  deps?: Deps<T>
  children: (store: T) => ReactNode
}

export function Consumer<T>(props: Props<T>) {
  const store = useStore(props.of)
  return props.children(store) as ReactElement
}

export function useStore<T>(S: Store<T>, deps?: Deps<T>) {
  const Context = Reflect.getMetadata(contextSymbol, S)
  if (!Context) {
    console.error(`No store context of "${S.name}" found. Did you provide it?`)
    return
  }
  useDebugValue(S.name)
  const container = useContext(Context) as Container<T>
  
  const [state, setState] = useState<T>(container.store)
  
  const depsRef = useRef<unknown[]>([])
  
  useEffect(() => {
    const subscriber = () => {
      if (!deps) {
        setState(container.store)
      } else {
        const oldDeps = depsRef.current
        const newDeps = deps(container.store)
        if (compare(oldDeps, newDeps)) {
          setState(container.store)
        }
        depsRef.current = newDeps
      }
    }
    container.subscribers.add(subscriber)
    return () => {
      container.subscribers.delete(subscriber)
    }
  }, [])
  
  return state
}

function compare(oldDeps: unknown[], newDeps: unknown[]) {
  if (oldDeps.length !== newDeps.length) {
    return true
  }
  for (const index in newDeps) {
    if (oldDeps[index] !== newDeps[index]) {
      return true
    }
  }
  return false
}
