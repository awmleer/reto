import * as React from 'react'
import {createRef, forwardRef, MutableRefObject, ReactNode, useCallback, useMemo, useRef, useState} from 'react'
import {Container} from './container'
import {MemoChildren} from './memo-children'
import {StateBox} from './state-box'
import {Store} from './store'
import {contextSymbol} from './symbols'

export interface ProviderProps<T> {
  of: Store<T>
  args?: unknown[]
  ref?: MutableRefObject<T>
}

type Props<T> = ProviderProps<T> & {
  children: ReactNode
}

export const Provider = forwardRef(function Provider<T>(props: Props<T>, ref: MutableRefObject<T>) {
  let Context = Reflect.getMetadata(contextSymbol, props.of)
  if (!Context) {
    Context = React.createContext(null)
    Reflect.defineMetadata(contextSymbol, Context, props.of)
  }
  
  const containerRef = useRef<Container<T>>()
  if (!containerRef.current) {
    containerRef.current = new Container<T>()
  }
  const container = containerRef.current
  
  const store = props.args ? props.of(...props.args) : props.of()
  if (ref) ref.current = store
  container.store = store
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

export function withProvider<P, T= any>(providerProps: ((props: P) => ProviderProps<T>) | ProviderProps<T>) {
  return function(C: React.ComponentType<P>): React.ComponentType<P> {
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
