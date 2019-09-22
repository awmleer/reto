import * as React from 'react'
import {ReactNode, useContext, useDebugValue, useEffect, useRef, useState} from 'react'
import {ReactElement} from 'react'
import {Container} from './container'
import {getStoreContext, Store} from './store'

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
  const Context = S.optional ? getStoreContext(S) : S.Context
  const name = S.displayName || S.name
  if (!Context) {
    console.error(`No store context of "${name}" found. Did you provide it?`)
    return
  }
  useDebugValue(name)
  const container = useContext(Context) as Container<T>
  
  const [state, setState] = useState<T>(container.state)
  
  const depsRef = useRef<unknown[]>([])
  
  useEffect(() => {
    const subscriber = () => {
      if (!deps) {
        setState(container.state)
      } else {
        const oldDeps = depsRef.current
        const newDeps = deps(container.state)
        if (compare(oldDeps, newDeps)) {
          setState(container.state)
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
