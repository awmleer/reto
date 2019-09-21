import {Store} from './store'

type Subscriber = () => void

export class Container<T> {
  subscribers = new Set<Subscriber>()
  constructor(
    public state?: ReturnType<Store<T>>
  ) {}
  notify() {
    for (const subscriber of this.subscribers) {
      subscriber()
    }
  }
}
