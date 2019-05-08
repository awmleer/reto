import * as React from 'react'

export type ConstructorType<T> = { new (...args: any[]): T }

export class Store {
  storeWillDestroy?(): void
}

export const contextSymbol = Symbol()
