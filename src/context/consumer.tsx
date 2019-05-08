import * as React from 'react'
import {ConstructorType, Store} from '../store'
import {ReactNode, useEffect, useState} from 'react'
import {contextSymbol, subscribersSymbol} from '../metadata-symbols'

interface Props<T> {
  of: ConstructorType<Store<T>>
  children: (store: T)=>ReactNode
}

// export class Consumer<T> extends React.Component<Props<T>, {}> {
//   render() {
//     const { of } = this.props
//     const Context = Reflect.getMetadata(contextSymbol, of)
//     return (
//       <Context.Consumer>
//         {(value: T) => (
//           this.props.children(value)
//         )}
//       </Context.Consumer>
//     )
//   }
// }

export function useStore<T extends Store<any>>(B: ConstructorType<T>): T {
  const Context = Reflect.getMetadata(contextSymbol, B)
  const [, setState] = useState()
  const store = React.useContext(Context) as T
  useEffect(() => {
    function callback() {
      setState(store.state)
    }
    // const subscribers = Reflect.getMetadata(subscribersSymbol, store) as Array<Function>
    // subscribers.push(callback)
    store.subscribers.push(callback)
    return function() {
      // subscribers.splice(subscribers.indexOf(callback), 1)
      store.subscribers.splice(store.subscribers.indexOf(callback), 1)
    }
  }, [store])
  return store
}
