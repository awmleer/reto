import * as React from 'react'
import {FC, useCallback, useRef, useState} from 'react'
import {contextSymbol} from './metadata-symbols'
import {StateBox} from './state-box'
import {MemoChildren} from './memo-children'
import {Store} from './store'

export interface ProviderProps<T> {
  of: Store<T>
  args?: any[]
}

type Props<T> = ProviderProps<T> & {
  children: React.ReactNode
}

const notInitialized = Symbol()

export const Provider: FC<Props<any>> = function Provider<T>(props: Props<T>) {
  const [store, setStore] = useState<any>(notInitialized)
  const updateFlagRef = useRef({})
  const updateRef = useRef(false)

  if (updateRef.current) {
    updateFlagRef.current = {}
  } else {
    updateRef.current = true
  }

  let Context = Reflect.getMetadata(contextSymbol, props.of)
  if (!Context) {
    Context = React.createContext(null)
    Reflect.defineMetadata(contextSymbol, Context, props.of)
  }

  const onReactorChange = useCallback(function (value) {
    setStore(value)
    updateRef.current = false
  }, [])

  return (
    <Context.Provider value={store}>
      <StateBox useStore={props.of} args={props.args} onChange={onReactorChange}/>
      {store !== notInitialized && (
        <MemoChildren flag={updateFlagRef.current}>
          {props.children}
        </MemoChildren>
      )}
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
