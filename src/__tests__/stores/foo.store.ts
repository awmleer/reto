import {store, inject, Store} from '../..'

const defaultState = {
  x: 1
}

@store
export class FooStore extends Store<typeof defaultState> {
  state = defaultState
  foo: string = 'this is foo'
}

@store
export class FaaStore extends Store<{}> {
  constructor(
    public faa: string = 'this is faa'
  ) {
    super()
  }
}

@store
export class BarStore extends Store {
  constructor(
    @inject public fooStore: FooStore
  ) {
    super()
  }
}

