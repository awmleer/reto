import * as React from 'react'
import {PropsWithChildren, useRef, useState} from 'react'
import {Container} from './container'
import {Executor} from './executor'
import {getStoreContext, Store, StoreP, StoreV} from './store'

export interface Props<S extends Store = Store> {
  of: S
  args?: StoreP<S>
  memo?: boolean
}

export const Provider = function<S extends Store>(props: PropsWithChildren<Props<S>>) {
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

type FC<P extends {}> = (props: P) => React.ReactElement

const wrapped = <P extends {}>(options: Props, Inner: FC<P>) => (props: P) => (
  <Provider {...options}>
    <Inner {...props} />
  </Provider>
)

function mixin<P extends {}>(Component: FC<P>): FC<P>
function mixin<P extends {}>(props: Props): typeof mixin
function mixin(props: any, list: any[] = []) {
  if (props instanceof Function) {
    return list.reduce((sum, cur) => wrapped(cur, sum), props)
  }
  return (props1: any) => (mixin as any)(props1, [...list, props])
}

export function withProvider(props: Props) {
  return mixin(props)
}
