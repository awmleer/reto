import {Consumer, Provider, useStore, withProvider} from '..'
import {BarStore, FooStore} from './stores/foo.store'
import * as React from 'react'
import {FC, memo, useState} from 'react'
import * as testing from '@testing-library/react'


// let originalConsole: typeof global.console
// beforeEach(() => {
//   const mocked = jest.fn()
//   originalConsole = global.console
//   global.console = {
//     ...originalConsole,
//     error: mocked
//   }
// })
//
// afterEach(() => {
//   global.console = originalConsole
// })


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


test('withProvider', function () {
  const App = withProvider({
    of: FooStore,
    params: {initial: 123}
  })(function App() {
    const fooStore = useStore(FooStore)
    return <div>{fooStore.x}</div>
  })
  const renderer = testing.render(
    <App/>
  )
  expect(renderer.asFragment()).toMatchSnapshot()
})


test('Consumer', function () {
  const renderer = testing.render(
    <Provider of={FooStore}>
      <Consumer of={FooStore}>
        {fooStore => (
          fooStore.x
        )}
      </Consumer>
    </Provider>
  )
  expect(renderer.asFragment()).toMatchSnapshot()
})


test('provider initialize with params', function () {
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
    <Provider of={FooStore} params={{initial: 5}}>
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
        <Provider of={FooStore}>
          <ChildA/>
          <ChildB/>
        </Provider>
      </div>
    )
  }
  
  function Test() {
    const Component: FC = (props) => <div>{props.children}</div>
    return Component
  }

  const ChildA: FC = memo((props) => {
    renderCount.a++
    const fooStore = useStore(FooStore, (store) => [store.x])
    function changeStore() {
      fooStore.setX(fooStore.x + 1)
    }
    return (
      <div>
        <button onClick={changeStore}>Change Store</button>
        {fooStore.x}
      </div>
    )
  })
  
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
  expect(renderCount.a).toBe(2)
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


test('handle return undefined from state function', () => {
  function FooStore() {}
  const App = withProvider({
    of: FooStore
  })(function App() {
    const fooStore = useStore(FooStore)
    return <div>content</div>
  })
  const renderer = testing.render(
    <App/>
  )
  expect(renderer.asFragment()).toMatchSnapshot()
})


test('ref', function () {
  function FooStore() {
    return 'foo'
  }
  const storeRef = React.createRef<string>()
  const App = withProvider({
    of: FooStore,
    ref: storeRef
  })(function App() {
    const fooStore = useStore(FooStore)
    return null
  })
  const renderer = testing.render(
    <App/>
  )
  expect(storeRef.current).toBe('foo')
})

// test('handle no context', function() {
//   const originalError = console.error
//   console.error = jest.fn()
//
//   global.console = {
//     ...global.console,
//     error: () => {
//       console.log(1111111111)
//     }
//   }
//
//   const App: FC = () => {
//     const fooStore = useStore(FooStore)
//     return null
//   }
//   const renderer = testing.render(
//     <App/>
//   )
//
//   expect(console.error).toHaveBeenCalled()
//
//   console.error = originalError
// })
