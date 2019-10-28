import * as React from 'react'
import {PropsWithChildren, useRef, useState} from 'react'
import {Container} from './container'
import {Executor} from './executor'
import {getStoreContext, Store, StoreP, StoreV} from './store'

export interface ProviderProps<S extends Store> {
  of: S
  args?: StoreP<S>
  memo?: boolean
}

type Props<S extends Store> = PropsWithChildren<ProviderProps<S>>

export const Provider = function<S extends Store>(props: Props<S>) {
  const Context = getStoreContext(props.of)
  
  const containerRef = useRef<Container<StoreV<S>>>()
  if (!containerRef.current) {
    containerRef.current = new Container<StoreV<S>>()
  }
  const container = containerRef.current
  
  const [initialized, setInitialized] = useState(false)
  function onChange(value: StoreV<S>) {
    setInitialized(true)
    container.state = value
    container.notify()
  }
  
  return (
    <Context.Provider value={container}>
      <Executor useStore={props.of} args={props.args} onChange={onChange} memo={props.memo}/>
      {initialized && props.children}
    </Context.Provider>
  )
}

Provider.defaultProps = {
  args: [],
}

export function withProvider<P, S extends Store>(providerProps: ((props: P) => ProviderProps<S>) | ProviderProps<S>) {
  return function(C: React.ComponentType<P>): React.ComponentType<P> {
    return function WithProvider(props: P) {
      const finalProviderProps = typeof providerProps === 'function' ? providerProps(props) : providerProps
      return (
        <Provider {...(finalProviderProps as any)}>
          <C {...props} />
        </Provider>
      )
    }
  }
}
