import {injectable, inject} from '../..'

@injectable
export class FooStore {
  foo: string = 'this is foo'
}

@injectable
export class FaaStore {
  constructor(
    public faa: string = 'this is faa'
  ) {}
}

@injectable
export class BarStore {
  constructor(
    @inject public fooStore: FooStore
  ) {}
}

