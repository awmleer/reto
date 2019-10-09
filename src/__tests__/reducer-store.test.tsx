import {Consumer, Provider, useStore, withProvider} from '..'
import {BarStore, FooStore} from './stores/foo.store'
import * as React from 'react'
import {FC, useState} from 'react'
import * as testing from '@testing-library/react'
import {createReducerStore} from '../create-reducer-store'

test('reducer store', function () {
  const MyStore = createReducerStore({
    counter: 1
  }, {
    increase: (state, {amount}) => {
      return {
        ...state,
        counter: state.counter + amount
      }
    }
  })

  const App: FC = (props) => {
    const myStore = useStore(MyStore)

    function changeStore() {
      myStore.dispatch({
        type: 'increase',
        payload: {amount: 2}
      })
    }
    return (
      <div>
        <button onClick={changeStore}>Change</button>
        {myStore.state.counter}
      </div>
    )
  }
  const renderer = testing.render(
    <Provider of={MyStore}>
      <App/>
    </Provider>
  )
  expect(renderer.asFragment()).toMatchSnapshot()
  testing.fireEvent.click(testing.getByText(renderer.container, 'Change'))
  expect(renderer.asFragment()).toMatchSnapshot()
})
