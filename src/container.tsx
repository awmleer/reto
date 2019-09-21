import {Store} from './store'

type Subscriber = () => void


export class Container<T> {
  store: ReturnType<Store<T>>
  subscribers = new Set<Subscriber>()
  notify() {
    for (const subscriber of this.subscribers) {
      subscriber()
    }
  }
}
