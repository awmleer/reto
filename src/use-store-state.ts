import {useState} from 'react'
import produce from 'immer'

type Mutation<T> = (draft: T) => void

export function useStoreState<T = any>(initial: T | (() => T)): [T, ((mutation: Mutation<T>) => void)] {
  const [state, setState] = useState(initial)
  function mutateState(mutation: Mutation<T>) {
    setState(produce(state, mutation))
  }
  return [state, mutateState]
}
