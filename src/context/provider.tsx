import * as React from 'react'
import {ConstructorType, Store} from '../store'
import {FC, useContext, useEffect, useRef} from 'react'
import {contextSymbol, injectsSymbol, subscribersSymbol} from '../metadata-symbols'

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
  
  // private effectSubscriptions: Unsubscribable[] = []
  
  initialize() {
    if (!this._store) return
    // const effects: string[] = Reflect.getMetadata(effectsMetadataKey, this.storeType.prototype) || []
    // for (const effect of effects) {
    //   const stream$ = (this._store as {[key: string]: Subscribable<any>})[effect]
    //   const subscription = stream$.subscribe(doNothing)
    //   this.effectSubscriptions.push(subscription)
    // }
  }
  
  cleanUp() {
    if (typeof this._store !== 'object') return
    // for (const subscription of this.effectSubscriptions) {
    //   subscription.unsubscribe()
    // }
    // this.effectSubscriptions = []
    if (this._store.storeWillDestroy) {
      this._store.storeWillDestroy()
    }
  }
  
  hasStore() {
    return this._store !== undefined
  }
}

function useInjections<T>(Store: ConstructorType<T>, args?: any[]) {
  const injects = Reflect.getMetadata(injectsSymbol, Store) || []
  const paramTypes = Reflect.getMetadata('design:paramtypes', Store) || []
  for (let inject of injects) {
    const Context = Reflect.getMetadata(contextSymbol, paramTypes[inject])
    const injection = useContext(Context)
    if (args) {
      args[inject] = injection
    }
  }
}

function createStore<T>(Store: ConstructorType<T>, args?: any[]) {
  //FIXME
  const store = new Store(...args)
  return store
}

export const Provider: FC<Props<any>> = function Provider<T>(props: Props<T>) {
  const containerRef = useRef(new StoreContainer())
  useInjections(props.of, props.args)
  
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


function doNothing() {}