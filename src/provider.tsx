import * as React from 'react'
import {forwardRef, MutableRefObject, PropsWithChildren, Ref, useImperativeHandle, useRef, useState} from 'react'
import {Container} from './container'
import {Executor} from './executor'
import {getStoreContext, Store, StoreP, StoreV} from './store'

interface Props<S extends Store = Store> {
  of: S
  args?: StoreP<S>
  memo?: boolean
  storeRef?: Ref<StoreV<S>>
}

export const Provider = function<S extends Store>(props: PropsWithChildren<Props<S>>) {
  const Context = getStoreContext(props.of)
  
  const containerRef = useRef<Container<StoreV<S>>>()
  if (!containerRef.current) {
    containerRef.current = new Container<StoreV<S>>()
  }
  const container = containerRef.current
  
  const checkRef = useRef<CheckRef>()
  function onChange(value: StoreV<S>) {
    if (props.storeRef) {
      if (typeof props.storeRef === 'function') {
        props.storeRef(value)
      } else {
        (props.storeRef as MutableRefObject<StoreV<S>>).current = value
      }
    }
    checkRef.current.onInitialize()
  }
  
  return (
    <>
      <Executor useStore={props.of} args={props.args} onChange={onChange} memo={props.memo} container={container}/>
      <Context.Provider value={container}>
        <Checker container={container} ref={checkRef}>
          {props.children}
        </Checker>
      </Context.Provider>
    </>
  )
}

Provider.displayName = 'Provider'

Provider.defaultProps = {
  args: [],
}

interface CheckRef {
  onInitialize: () => void
}

const Checker = forwardRef<CheckRef, PropsWithChildren<{
  container: Container<any>
}>>((props, ref) => {
  const [initialized, setInitialized] = useState(props.container.initialized)
  
  useImperativeHandle(ref, () => ({
    onInitialize: () => {
      setInitialized(true)
    }
  }))
  
  return initialized && (
    <>
      {props.children}
    </>
  )
})

Checker.displayName = 'Checker'
