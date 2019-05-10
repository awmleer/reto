import * as React from 'react'
import {ConstructorType, Store} from '../store'
import {FC, useContext, useEffect, useRef} from 'react'
import {contextSymbol, injectsSymbol} from '../metadata-symbols'
import {InjectMark} from '../di'
import {useStoreUpdate} from './consumer'

export interface ProviderProps<T> {
  of: ConstructorType<Store<T>>
  args?: any[]
}

type Props<T> = ProviderProps<T> & {
  children: React.ReactNode
}

class StoreContainer {
  public storeType: ConstructorType<Store<any>> = null
  
  private _store: Store<any> = undefined
  public get store() {
    return this._store
  }
  public set store(newStore: any) {
    if (newStore === undefined) return
    if (newStore === this._store) return
    this.cleanUp()
    this._store = newStore
    this.initialize()
  }
  
  initialize() {
    if (!this._store) return
  }
  
  cleanUp() {
    if (typeof this._store !== 'object') return
    if (this._store.storeWillDestroy) {
      this._store.storeWillDestroy()
    }
  }
  
  hasStore() {
    return this._store !== undefined
  }
}

function useInjections(store: Store) {
  const injects: InjectMark[] = Reflect.getMetadata(injectsSymbol, store) || []
  for (let inject of injects) {
    const injectedStore = useContext(inject.context)
    Object.defineProperty(store, inject.key, {
      value: injectedStore,
      writable: false,
    })
    useEffect(() => {
      const callback = store.propagate.bind(store)
      injectedStore.subscribers.push(callback)
      return function() {
        injectedStore.subscribers.splice(injectedStore.subscribers.indexOf(callback), 1)
      }
    }, [injectedStore])
  }
}

function createStore<T extends Store>(storeType: ConstructorType<T>, args?: any[]) {
  const store = new storeType(...args)
  // for (const injection of injections) {
  //   store[injection.key] = injection.instance
  // }
  return store
}

export const Provider: FC<Props<any>> = function Provider<T>(props: Props<T>) {
  const containerRef = useRef(new StoreContainer())
  
  if (containerRef.current.storeType !== props.of) {
    containerRef.current.storeType = props.of
    containerRef.current.store = createStore(props.of, props.args)
  }
  
  if (!containerRef.current.hasStore()) {
    containerRef.current.store = createStore(props.of, props.args)
  }
  
  useInjections(containerRef.current.store)
  
  useEffect(() => {
    return () => {
      containerRef.current.store = null
    }
  }, [])
  
  const Context = Reflect.getMetadata(contextSymbol, props.of)
  return (
    <Context.Provider value={containerRef.current.store}>
      {props.children}
    </Context.Provider>
  )
}
Provider.defaultProps = {
  args: []
}


export function withProvider<P, T=any>(providerProps: ((props: P) => ProviderProps<T>) | ProviderProps<T>) {
  return function (C: React.ComponentType<P>): React.ComponentType<P> {
    return function WithProvider(props: P) {
      const finalProviderProps = typeof providerProps === 'function' ? providerProps(props) : providerProps
      return (
        <Provider {...finalProviderProps}>
          <C {...props} />
        </Provider>
      )
    }
  }
}
