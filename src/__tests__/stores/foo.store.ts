import {store, inject, Store} from '../..'

@store
export class FooStore {
  foo: string = 'this is foo'
}

@store
export class FaaStore {
  constructor(
    public faa: string = 'this is faa'
  ) {}
}

@store
export class BarStore {
  constructor(
    @inject public fooStore: FooStore
  ) {}
}

