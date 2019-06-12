import * as React from 'react'
import {ConstructorType, Store} from '../store'
import {FC, useEffect, useRef} from 'react'
import {contextSymbol} from '../metadata-symbols'
import {shared} from '../../shared'

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
    //TODO
  }
  
  hasStore() {
    return this._store !== undefined
  }
}


function createStore<T extends Store>(storeType: Function, args?: any[]) {
  shared.creating = true
  const store = storeType(...args)
  shared.creating = false
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
  
  useEffect(() => {
    return () => {
      containerRef.current.store = null
    }
  }, [])
  
  let Context = Reflect.getMetadata(contextSymbol, props.of)
  if (!Context) {
    Context = React.createContext(null)
    Reflect.defineMetadata(contextSymbol, Context, props.of)
  }
  
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
