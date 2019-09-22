import * as React from 'react'
import {forwardRef, MutableRefObject, ReactNode, useRef} from 'react'
import {Container} from './container'
import {getStoreContext, Store} from './store'

export interface ProviderProps<F extends (...args: any) => any> {
  of: Store<F>
  args?: Parameters<F>
  ref?: MutableRefObject<ReturnType<F>>
}

type Props<F extends (...args: any) => any> = ProviderProps<F> & {
  children: ReactNode
}

export const Provider = forwardRef(function Provider<F extends (...args: any) => any>(props: Props<F>, ref: MutableRefObject<ReturnType<F>>) {
  const Context = getStoreContext(props.of)
  
  const containerRef = useRef<Container<F>>()
  if (!containerRef.current) {
    containerRef.current = new Container<F>()
  }
  const container = containerRef.current
  
  const store = props.of(...props.args) as ReturnType<F>
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
