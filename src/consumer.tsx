import * as React from 'react'
import {ReactNode, useContext, useDebugValue, useEffect, useRef, useState} from 'react'
import {ReactElement} from 'react'
import {Container} from './container'
import {getStoreContext, Store} from './store'

type Deps<S> = (store: S) => unknown[]

interface Props<S extends Store> {
  of: S
  deps?: Deps<S>
  children: (store: ReturnType<S>) => ReactNode
}

export function Consumer<S extends Store>(props: Props<S>) {
  const store = useStore(props.of)
  return props.children(store) as ReactElement
}

export function useStore<S extends Store>(S: Store<S>, deps?: Deps<S>): ReturnType<S> {
  const Context = S.optional ? getStoreContext(S) : S.Context
  const name = S.displayName || S.name
  if (!Context) {
    console.error(`No store context of "${name}" found. Did you provide it?`)
    return
  }
  useDebugValue(name)
  const container = useContext(Context) as Container<S>
  
  const [state, setState] = useState<ReturnType<S>>(container.state)
  
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
