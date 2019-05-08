import * as React from 'react'
import {ConstructorType, Store, contextSymbol} from '../store'
import {ReactNode} from 'react'

interface Props<T extends Store> {
  of: ConstructorType<T>
  children: (store: T)=>ReactNode
}

export class Consumer<T> extends React.Component<Props<T>, {}> {
  render() {
    const { of } = this.props
    const Context = Reflect.getMetadata(contextSymbol, of)
    return (
      <Context.Consumer>
        {(value: T) => (
          this.props.children(value)
        )}
      </Context.Consumer>
    )
  }
}

export function useStore<T>(B: ConstructorType<T>): T {
  const Context = Reflect.getMetadata(contextSymbol, B)
  return React.useContext(Context) as T
}
