import {Store} from './store'

type Subscriber = () => void

export class Container<S extends Store> {
  subscribers = new Set<Subscriber>()
  constructor(
    public state?: ReturnType<S>
  ) {}
  notify() {
    for (const subscriber of this.subscribers) {
      subscriber()
    }
  }
}
