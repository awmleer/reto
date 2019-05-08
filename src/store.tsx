import * as React from 'react'
import {contextSymbol} from './metadata-symbols'

export type ConstructorType<T> = { new (...args: any[]): T }

export interface Store {
  storeWillDestroy?(): void
}


export function store<T extends {new(...args:any[]):{}}>(constructor: T) {
  Reflect.defineMetadata(contextSymbol, React.createContext(null), constructor)
}
