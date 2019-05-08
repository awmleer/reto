import * as React from 'react'
import {contextSymbol} from './metadata-symbols'
import {createDraft, Draft, finishDraft} from 'immer'

export type ConstructorType<T> = { new (...args: any[]): T }

export class Store<T extends {} = {}> {
  state: T
  // getters: {}
  storeWillDestroy?(): void
  mutate(f: (draft: Draft<T>) => void) {
    const draft = createDraft(this.state)
    f(draft)
    this.state = finishDraft(draft) as T
    for (let subscriber of this.subscribers) {
      subscriber()
    }
  }
  subscribers: Function[] = []
}


export function store<T extends {new(...args:any[]):{}}>(constructor: T) {
  Reflect.defineMetadata(contextSymbol, React.createContext(null), constructor)
}