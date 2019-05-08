import {injectsSymbol} from './metadata-symbols'

export function inject(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  let injects: number[] = Reflect.getOwnMetadata(injectsSymbol, target, propertyKey) || []
  injects.push(parameterIndex)
  Reflect.defineMetadata(injectsSymbol, injects, target, propertyKey)
}
