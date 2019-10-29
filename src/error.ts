import {Store} from './store'

export class NoStoreError<S extends Store> {
  constructor(
    public message: string,
    public store: S,
  ) {}
}
