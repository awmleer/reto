import * as React from 'react'
import {Store} from '../store'
import {FC, useEffect, useRef} from 'react'
import {contextSymbol} from '../metadata-symbols'
import {shared} from '../../shared'
import {StoreContainer} from '../container'

export interface ProviderProps<T> {
  of: Function
  args?: any[]
}

type Props<T> = ProviderProps<T> & {
  children: React.ReactNode
}

function createStore<T extends Store>(container: StoreContainer, storeType: Function, args?: any[]) {
  shared.creating = true
  shared.currentContainer = container
  container.store = storeType(...args)
  shared.creating = false
}

export const Provider: FC<Props<any>> = function Provider<T>(props: Props<T>) {
  const containerRef = useRef(new StoreContainer())
  
  if (containerRef.current.storeType !== props.of) {
    containerRef.current.storeType = props.of
    createStore(containerRef.current, props.of, props.args)
  }
  
  if (!containerRef.current.hasStore()) {
    createStore(containerRef.current, props.of, props.args)
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
    <Context.Provider value={containerRef.current}>
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
