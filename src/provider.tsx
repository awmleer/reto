import * as React from 'react'
import {forwardRef, MutableRefObject, ReactNode, useRef} from 'react'
import {Container} from './container'
import {getStoreContext, Store} from './store'

export interface ProviderProps<T> {
  of: Store<T>
  args?: unknown[]
  ref?: MutableRefObject<T>
}

type Props<T> = ProviderProps<T> & {
  children: ReactNode
}

export const Provider = forwardRef(function Provider<T>(props: Props<T>, ref: MutableRefObject<T>) {
  const S = props.of
  const Context = getStoreContext(S)
  
  const containerRef = useRef<Container<T>>()
  if (!containerRef.current) {
    containerRef.current = new Container<T>()
  }
  const container = containerRef.current
  
  const store = props.args ? props.of(...props.args) : props.of()
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
  args: [],
}

export function withProvider<P, T>(providerProps: ((props: P) => ProviderProps<T>) | ProviderProps<T>) {
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
