import {Provider, Store, store, useStore} from '..'
import {BarStore, BarWithoutDecoratorStore, FooStore} from './stores/foo.store'
import * as React from 'react'
import {FC, useEffect} from 'react'
import * as testing from 'react-testing-library'
import {number} from 'prop-types'
import {sleep} from './utils'
import {act} from 'react-testing-library'


test('provider initialize', function () {
  const App: FC = (props) => {
    const fooStore = useStore(FooStore)
    
    function changeStore() {
      fooStore.mutate(draft => {
        draft.x++
      })
    }
    return (
      <div>
        <button onClick={changeStore}>Change</button>
        {fooStore.state.x}
      </div>
    )
  }
  const renderer = testing.render(
    <Provider of={FooStore}>
      <App/>
    </Provider>
  )
  expect(renderer.asFragment()).toMatchSnapshot()
  testing.fireEvent.click(testing.getByText(renderer.container, 'Change'))
  expect(renderer.asFragment()).toMatchSnapshot()
})


test('rerender on dependency update', function () {
  const App: FC = (props) => {
    const barStore = useStore(BarStore)
    
    function changeStore() {
      barStore.fooStore.mutate(draft => {
        draft.x++
      })
    }
    return (
      <div>
        <button onClick={changeStore}>Change</button>
        {barStore.fooStore.state.x}
      </div>
    )
  }
  const renderer = testing.render(
    <Provider of={FooStore}>
      <Provider of={BarStore}>
        <App/>
      </Provider>
    </Provider>
  )
  expect(renderer.asFragment()).toMatchSnapshot()
  testing.fireEvent.click(testing.getByText(renderer.container, 'Change'))
  expect(renderer.asFragment()).toMatchSnapshot()
})


test('without decorator', function () {
  const App: FC = () => {
    const barStore = useStore(BarWithoutDecoratorStore)
    return (
      <div>
        {barStore.fooStore.state.x}
      </div>
    )
  }
  
  const renderer = testing.render(
    <Provider of={FooStore}>
      <Provider of={BarWithoutDecoratorStore}>
        <App/>
      </Provider>
    </Provider>
  )
  
  expect(renderer.asFragment()).toMatchSnapshot()
})

test('mutate immediately', async function () {
  @store
  class TestStore extends Store<{x: number}> {
    state = {
      x: 1
    }
    async testMutate() {
      await sleep(1)
      this.mutate(draft => {
        draft.x++
      })
    }
    constructor() {
      super()
      this.testMutate()
    }
  }
  
  const App: FC = (props) => {
    const testStore = useStore(TestStore)
    return (
      <div>
        {testStore.state.x}
      </div>
    )
  }
  let renderer: any
  act(() => {
    renderer = testing.render(
      <Provider of={TestStore}>
        <App/>
      </Provider>
    )
  })
  
  await sleep(20)
  expect(renderer.asFragment()).toMatchSnapshot()
})
