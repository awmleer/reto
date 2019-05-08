import * as React from 'react'

export type ConstructorType<T> = { new (...args: any[]): T }

export interface Store {
  storeWillDestroy?(): void
}

export const contextSymbol = Symbol()

export function store<T extends {new(...args:any[]):{}}>(constructor: T) {
  Reflect.defineMetadata(contextSymbol, React.createContext(null), constructor)
}
