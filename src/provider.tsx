import * as React from 'react'
import {forwardRef, MutableRefObject, ReactNode, useRef} from 'react'
import {Container} from './container'
import {getStoreContext, Store, StoreParams, StoreValue} from './store'

export interface ProviderProps<S extends Store> {
  of: S
  params?: StoreParams<S>
  ref?: MutableRefObject<StoreValue<S>>
}

type Props<S extends Store> = ProviderProps<S> & {
  children: ReactNode
}

export const Provider = forwardRef(function Provider<S extends Store>(props: Props<S>, ref: MutableRefObject<StoreValue<S>>) {
  const useStore = props.of as S
  const Context = getStoreContext(useStore)
  
  const containerRef = useRef<Container<StoreValue<S>>>()
  if (!containerRef.current) {
    containerRef.current = new Container<StoreValue<S>>()
  }
  const container = containerRef.current
  
  const store = useStore(props.params) as StoreValue<S>
  if (ref) ref.current = store
  container.state = store
  container.notify()
  
  return (
    <Context.Provider value={container}>
      {props.children}
    </Context.Provider>
  )
})

Provider.defaultProps = {
  params: {},
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
