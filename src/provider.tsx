import * as React from 'react'
import {
  forwardRef,
  ForwardRefExoticComponent,
  MutableRefObject,
  RefForwardingComponent,
  useCallback,
  useRef,
  useState,
} from 'react'
import {contextSymbol} from './symbols'
import {StateBox} from './state-box'
import {MemoChildren} from './memo-children'
import {Store} from './store'

export interface ProviderProps<T> {
  of: Store<T>
  args?: unknown[]
  ref?: MutableRefObject<T>
}

type Props<T> = ProviderProps<T> & {
  children: React.ReactNode
}

const notInitialized = Symbol()

export const Provider = forwardRef(function Provider<T>(props: Props<T>, ref: MutableRefObject<T>) {
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
    if (ref) ref.current = value
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
})

Provider.defaultProps = {
  args: []
}


export function withProvider<P, T=unknown, R=unknown>(providerProps: ((props: P) => ProviderProps<T>) | ProviderProps<T>) {
  return function (C: React.ComponentType<P>) {
    return forwardRef<R, P>(function WithProvider(props, ref) {
      const finalProviderProps = typeof providerProps === 'function' ? providerProps(props) : providerProps
      return (
        <Provider {...finalProviderProps}>
          <C {...props} ref={ref}/>
        </Provider>
      )
    })
  }
}
