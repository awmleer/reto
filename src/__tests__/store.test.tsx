import * as TestRenderer from 'react-test-renderer'
import {Provider, useStore} from '..'
import {FooStore} from './stores/foo.store'
import * as React from 'react'
import {FC} from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

it('provider initialize', function () {
  const App: FC = (props) => {
    const fooStore = useStore(FooStore)
    
    function changeStore() {
      fooStore.foo = 'foo changed'
    }
    return (
      <div>
        <button id='btn' onClick={changeStore}/>
        {fooStore.foo}
      </div>
    )
  }
  const renderer = TestRenderer.create(
    <Provider of={FooStore}>
      <App/>
    </Provider>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
  ReactTestUtils.Simulate.click(renderer.root.findByProps({id: 'btn'}))
  expect(renderer.toJSON()).toMatchSnapshot()
})
