## Pass Arguments to Store

You can use the `args` prop of `Provider` to pass arguments to Store.

```jsx
export function FooStore(initial = 1) {
  const [x, setX] = useState(initial)
  return {
    x,
    setX
  }
}
```

```jsx
<Provider of={FooStore} args={[5]}>
  <App/>
</Provider>
```

## withProvider

Sometimes we need to use a store in the same component that provides it, for example:

```jsx
export function App(props) {
  const fooStore = useStore(FooStore) // ⚠️Can't get fooStore here
  return (
    <Provider of={FooStore}>
      <p>{fooStore.x}</p>
    </Provider>
  )
}
```

We hope to create a `Provider` of `FooStore` in `App` component, and call `useStore(FooStore)` in it at the same time. OK, we got `withProvider` for you:

```jsx
export const App = withProvider({
  of: FooStore
})((props) => {
  const fooStore = useStore(FooStore) // 🎉 Now we can get fooStore here
  return (
    <p>{fooStore.x}</p>
  )
})
```

`withProvider` is a HOC(Higher-Order Component). First, we pass a props object to it(just like what we do in jsx, but in the format of object). And then we pass our component to it.

```jsx
withProvider({
  of: FooStore,
  args: [42, 'abc'],
})(YourComponent)
```

What's more，you can build your own Higher-Order Components based on `withProvider`:

```js
const provideFooStore = withProvider({
  of: FooStore
})

export const App = provideFooStore((props) => {
  //...
})
```

## Use in Class Components

Even though Reto itself is written with hooks, it is still supported to use Reto in class components. You may wonder how to use `useStore` in class components. The answer is: No, you can't. But, there is an substitute for `useStore`, which is `Consumer` component:

```jsx
import {Consumer} from 'reto'

export class App extends Component {
  render() {
    return (
      <Consumer of={FooStore}>
        {fooStore => (
          fooStore.x
        )}
      </Consumer>
    )
  }
}
```


## How to Solve the Performance Issue

If a store is too big or it updates too frequently, there may be a performance issue.

Since `useStore` is actually `useContext` under the hood, you can solve this issue by the same way of `useContext`. Please see [this](https://github.com/facebook/react/issues/15156#issuecomment-474590693) for reference.
