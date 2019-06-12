import {shared} from '../shared'
import {StateContainer} from './container'

export function useStoreState<T>(value: T) {
  const container = shared.currentContainer
  container.states[container.stateCounter] = new StateContainer(value, container.propagate)
  container.stateCounter++
}
