import {Store} from './store'
import produce, {Draft} from 'immer'

export class StateContainer<T = any> {
  mutate(f: (draft: Draft<T>) => void) {
    this.state = produce(this.state, f)
    this.callback()
  }
  next: StateContainer = null
  constructor(
    public state: T,
    public callback: Function,
  ) {}
}

export class StoreContainer {
  public storeType: Function = null
  
  private _store: Store<any> = undefined
  public get store() {
    return this._store
  }
  public set store(newStore: any) {
    if (newStore === undefined) return
    if (newStore === this._store) return
    this.cleanUp()
    this._store = newStore
    this.initialize()
  }
  
  states: StateContainer[] = []
  stateCounter = 0
  
  propagate() {
    for (let subscriber of this.subscribers) {
      subscriber()
    }
  }
  subscribers: Function[] = []
  
  initialize() {
    if (!this._store) return
  }
  
  cleanUp() {
    //TODO
  }
  
  hasStore() {
    return this._store !== undefined
  }
}
