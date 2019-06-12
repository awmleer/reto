import {useState} from 'react'
import produce from 'immer'


export function useStoreState<T = any>(initial: T | (() => T)): [T, ((mutateState: (draft: T) => void) => void)] {
  const [state, setState] = useState(initial)
  function mutateState(mutation: (draft: T) => void) {
    setState(produce(state, mutation))
  }
  return [state, mutateState]
}
