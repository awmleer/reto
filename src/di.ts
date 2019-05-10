import {contextSymbol, injectsSymbol} from './metadata-symbols'
import {Store, StoreType} from './store'
import {Context} from 'react'

// export function inject(target: Object, propertyKey: string | symbol, parameterIndex: number) {
//   let injects: number[] = Reflect.getOwnMetadata(injectsSymbol, target, propertyKey) || []
//   injects.push(parameterIndex)
//   Reflect.defineMetadata(injectsSymbol, injects, target, propertyKey)
// }

export interface InjectMark {
  key: string
  context: Context<Store>
}

export interface InjectionMark {
  key: string
  instance: Store
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
  // return Reflect.metadata(injectSymbol, storeType)
}
