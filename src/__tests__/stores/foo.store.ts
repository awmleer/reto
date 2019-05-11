import {store, inject, Store} from '../..'

interface State {
  x: number
}

@store
export class FooStore extends Store<State> {
  state = {
    x: 1
  }
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
  @inject(FooStore) fooStore: FooStore
}

export class BarWithoutDecoratorStore extends Store {
  constructor() {
    super()
    inject(FooStore)(this, 'fooStore')
  }
  fooStore: FooStore
}
store(BarWithoutDecoratorStore)
