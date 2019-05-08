import {Provider, useStore} from '..'
import {FooStore} from './stores/foo.store'
import * as React from 'react'
import {FC} from 'react'
import * as testing from 'react-testing-library'
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
