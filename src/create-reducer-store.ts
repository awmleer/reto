import {useReducer} from "react"

type Reducer<S> = (state: S, payload: unknown) => S

type Reducers<S> = {
  [action: string]: Reducer<S>
}

type Action<R extends Reducers<unknown>> = {
  type: keyof R
  payload: unknown
}

export function createReducerStore<S, R extends Reducers<S>>(initialState: S, reducers: R) {
  return function() {
    const [state, dispatch] = useReducer((state, action: Action<R>) => {
      return reducers[action.type](state, action.payload)
    }, initialState)
    return {
      state,
      dispatch,
    }
  }
}
