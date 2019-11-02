import * as React from 'react'
import { useStore } from '../consumer'
import { withProvider } from '../provider'
import { render } from '@testing-library/react'

test('wrap the component with one provider', () => {
  const FooStore = (val: string) => {
    const [bar, setBar] = React.useState(val)
    return { bar, setBar }
  }

  const Comp = (props: { name: string }) => {
    const { bar } = useStore(FooStore)
    return (
      <h1 data-testid="target">
        Hello, {props.name}! The bar is {bar}
      </h1>
    )
  }

  const CompWithProvider = withProvider({ of: FooStore, args: ['bar'] })(Comp)

  const { getByTestId } = render(<CompWithProvider name="Reto" />)
  const target = getByTestId('target')

  expect(target.textContent).toBe('Hello, Reto! The bar is bar')
})

test('wrap the component with several providers', () => {
  const FooStore = (defaulVal: string) => {
    const [foo, setFoo] = React.useState(defaulVal)
    return { foo, setFoo }
  }

  const BarStore = (defaultVal: number) => {
    const [bar, setBar] = React.useState(defaultVal)
    return { bar, setBar }
  }

  const Comp = (props: { name: string }) => {
    const { foo } = useStore(FooStore)
    const { bar } = useStore(BarStore)

    return (
      <h1 data-testid="target">
        Hello, {props.name}! {foo}, {bar}
      </h1>
    )
  }

  const CompWithProvider = withProvider({ of: FooStore, args: ['foo'] })({
    of: BarStore,
    args: [3000],
  })(Comp)

  const { getByTestId } = render(<CompWithProvider name="Reto" />)
  const target = getByTestId('target')

  expect(target.textContent).toBe('Hello, Reto! foo, 3000')
})
