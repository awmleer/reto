type Subscriber = () => void

export class Container<V> {
  subscribers = new Set<Subscriber>()
  constructor(
    public state?: V
  ) {}
  initialized = false
  notify() {
    for (const subscriber of this.subscribers) {
      subscriber()
    }
  }
}
