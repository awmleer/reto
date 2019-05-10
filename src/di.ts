import {contextSymbol, injectsSymbol} from './metadata-symbols'
import {Store, StoreType} from './store'
import {Context} from 'react'

export interface InjectMark {
  key: string
  context: Context<Store>
}

export function inject(storeType: StoreType) {
  return function (target: Store, key: string) {
    let injects: InjectMark[] = Reflect.getMetadata(injectsSymbol, target)
    if (!injects) {
      injects = []
      Reflect.defineMetadata(injectsSymbol, injects, target)
    }
    injects.push({
      key,
      context: Reflect.getMetadata(contextSymbol, storeType)
    })
  }
}
