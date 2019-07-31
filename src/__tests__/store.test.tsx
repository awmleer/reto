import {Provider, useStore} from '..'
import {BarStore, FooStore} from './stores/foo.store'
import * as React from 'react'
import {FC, useState} from 'react'
import * as testing from 'react-testing-library'


test('provider initialize', function () {
  const App: FC = (props) => {
    const fooStore = useStore(FooStore)

    function changeStore() {
      fooStore.setX(fooStore.x + 1)
    }
    return (
      <div>
        <button onClick={changeStore}>Change</button>
        {fooStore.x}
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


test('provider initialize with args', function () {
  const App: FC = (props) => {
    const fooStore = useStore(FooStore)

    function changeStore() {
      fooStore.setX(fooStore.x + 1)
    }
    return (
      <div>
        <button onClick={changeStore}>Change</button>
        {fooStore.x}
      </div>
    )
  }
  const renderer = testing.render(
    <Provider of={FooStore} args={[5]}>
      <App/>
    </Provider>
  )
  expect(renderer.asFragment()).toMatchSnapshot()
  testing.fireEvent.click(testing.getByText(renderer.container, 'Change'))
  expect(renderer.asFragment()).toMatchSnapshot()
})


test('no extra render on children', function () {
  const renderCount = {
    a: 0,
    b: 0,
  }

  const Parent: FC = props => {
    const [state, setState] = useState(1)
    return (
      <div>
        <button onClick={() => setState(state + 1)}>Change Parent</button>
        parent state: {state}
        <Provider of={FooStore} args={[]}>
          <ChildA/>
          <ChildB/>
        </Provider>
      </div>
    )
  }

  const ChildA: FC = (props) => {
    renderCount.a++
    const fooStore = useStore(FooStore)
    function changeStore() {
      fooStore.setX(fooStore.x + 1)
    }
    return (
      <div>
        <button onClick={changeStore}>Change Store</button>
        {fooStore.x}
      </div>
    )
  }
  const ChildB: FC = (props) => {
    renderCount.b++
    return null
  }
  const renderer = testing.render(
    <Parent/>
  )
  expect(renderer.asFragment()).toMatchSnapshot()
  testing.fireEvent.click(testing.getByText(renderer.container, 'Change Store'))
  expect(renderer.asFragment()).toMatchSnapshot()
  testing.fireEvent.click(testing.getByText(renderer.container, 'Change Parent'))
  expect(renderer.asFragment()).toMatchSnapshot()
  testing.fireEvent.click(testing.getByText(renderer.container, 'Change Parent'))
  expect(renderer.asFragment()).toMatchSnapshot()
  expect(renderCount.a).toBe(4)
  expect(renderCount.b).toBe(3)
})


test('rerender on dependency update', function () {
  const App: FC = (props) => {
    const barStore = useStore(BarStore)

    function changeStore() {
      barStore.fooStore.setX(3)
    }
    return (
      <div>
        <button onClick={changeStore}>Change</button>
        {barStore.fooStore.x}
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


// test('mutate immediately', async function () {
//   @store
//   class TestStore extends Store<{x: number}> {
//     state = {
//       x: 1
//     }
//     async testMutate() {
//       await sleep(1)
//       this.mutate(draft => {
//         draft.x++
//       })
//     }
//     constructor() {
//       super()
//       this.testMutate()
//     }
//   }
//
//   const App: FC = (props) => {
//     const testStore = useStore(TestStore)
//     return (
//       <div>
//         {testStore.state.x}
//       </div>
//     )
//   }
//   let renderer: any
//   act(() => {
//     renderer = testing.render(
//       <Provider of={TestStore}>
//         <App/>
//       </Provider>
//     )
//   })
//
//   await sleep(20)
//   expect(renderer.asFragment()).toMatchSnapshot()
// })
