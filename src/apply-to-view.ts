import {subscribersSymbol} from './metadata-symbols'

export function applyToView(...stores: object[]) {
  for (let store of stores) {
    for (let subscriber of Reflect.getMetadata(subscribersSymbol, store)) {
      subscriber()
    }
  }
}
