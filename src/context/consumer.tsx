import * as React from 'react'
import {ConstructorType, Store} from '../store'
import {ReactNode, useEffect, useState} from 'react'
import {contextSymbol, subscribersSymbol} from '../metadata-symbols'

interface Props<T extends Store> {
  of: ConstructorType<T>
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

export function useStore<T>(B: ConstructorType<T>): T {
  const Context = Reflect.getMetadata(contextSymbol, B)
  const [, update] = useState(null)
  const store = React.useContext(Context) as T
  useEffect(() => {
    function callback() {
      update(null)
    }
    const subscribers = Reflect.getMetadata(subscribersSymbol, store) as Array<Function>
    subscribers.push(callback)
    return function() {
      subscribers.splice(subscribers.indexOf(callback), 1)
    }
  }, [store])
  return store
}
