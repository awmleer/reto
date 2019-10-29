import * as React from 'react'
import {ReactNode, useContext, useDebugValue, useEffect, useRef, useState} from 'react'
import {ReactElement} from 'react'
import {Container} from './container'
import {NoStoreError} from './error'
import {defaultStoreValue, getStoreContext, Store, StoreV} from './store'

type Deps<T> = (store: T) => unknown[]

interface Props<S extends Store> {
  of: S
  deps?: Deps<StoreV<S>>
  children: (store: StoreV<S>) => ReactNode
}

export function Consumer<S extends Store>(props: Props<S>) {
  const store = useStore(props.of)
  return props.children(store) as ReactElement
}

export function useStore<S extends Store>(s: S, deps?: Deps<StoreV<S>>) {
  const name = s.displayName || s.name
  useDebugValue(name)
  const Context = getStoreContext(s)
  const container = useContext(Context) as Container<StoreV<S>>
  
  const [state, setState] = useState<StoreV<S>>(container.state)
  
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
  
  if (state === defaultStoreValue) {
    throw new NoStoreError(`No store context of "${name}" found. And "${name}" doesn't have defaultValue. Either render a Provider or set a defaultValue for this Store.`, s)
  }
  
  return state
}

export function useStoreOptionally<S extends Store>(s: S, deps?: Deps<StoreV<S>>): [StoreV<S> | undefined, boolean] {
  try {
    const store = useStore(s, deps)
    return [store, true]
  } catch (e) {
    if (e instanceof NoStoreError) {
      return [undefined, false]
    } else {
      throw e
    }
  }
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
