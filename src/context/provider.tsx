import * as React from 'react'
import {FC, useCallback, useRef, useState} from 'react'
import {contextSymbol} from '../metadata-symbols'
import {Reactor} from '../reactor'
import {MemoChildren} from '../memo-children'

export interface ProviderProps<T> {
  of: Function
  args?: any[]
}

type Props<T> = ProviderProps<T> & {
  children: React.ReactNode
}

export const Provider: FC<Props<any>> = function Provider<T>(props: Props<T>) {
  const [store, setStore] = useState<any>(undefined)
  const updateSymbolRef = useRef(Symbol())
  const updateRef = useRef(true)
  
  if (updateRef.current) {
    updateSymbolRef.current = Symbol()
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
  }, [props.of])
  
  return (
    <Context.Provider value={store}>
      <Reactor useStore={props.of} args={props.args} onChange={onReactorChange}/>
      {store !== undefined && (
        <MemoChildren symbol={updateSymbolRef.current}>
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
