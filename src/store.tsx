import * as React from 'react'
import {contextSymbol} from './metadata-symbols'
import produce, {createDraft, Draft, finishDraft} from 'immer'

export type ConstructorType<T> = { new (...args: any[]): T }
export type StoreType<T extends Store = Store> = ConstructorType<T>

export class Store<T extends {} = {}> {
  state: T
  // getters: {}
  storeWillDestroy?(): void
  mutate(f: (draft: Draft<T>) => void) {
    this.state = produce(this.state, f)
    this.propagate()
  }
  propagate() {
    for (let subscriber of this.subscribers) {
      subscriber()
    }
  }
  subscribers: Function[] = []
  effects = [
    {
      handler: function () {
      
      },
      deps: function () {
      
      }
    }, {
    },
  ]
}


export function store<T extends {new(...args:any[]):{}}>(constructor: T) {
  Reflect.defineMetadata(contextSymbol, React.createContext(null), constructor)
}


// function useFunctionStore(Store: FunctionStore) {
//   const state = Store.init()
// }
