## Pass Arguments to Store

You can use the `params` prop of `Provider` to pass arguments to Store.

```jsx
export function FooStore(params) {
  const [x, setX] = useState(params.initial)
  return {
    x,
    setX
  }
}
```

```jsx
<Provider of={FooStore} params={{initial: 5}}>
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
  params: {
    count: 42,
    id: 'abc',
  },
})(MyComponent)
```

If you want to generate the `props` of `Provider` dynamically, you can pass a **function** to `withProvider`.

```jsx
withProvider(props => ({
  of: FooStore,
  params: {
    count: 42,
    id: props.id,
  },
}))(MyComponent)
```


What's more，you can build your own Higher-Order Components based on `withProvider`:

```js
const withFooStoreProvider = withProvider({
  of: FooStore
})

export const App = withFooStoreProvider((props) => {
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

You can pass an additional `deps` function to `useStore` for controlling whether to rerender.

```jsx
const fooStore = useStore(FooStore, store => [store.x, store.y[0]])
```

This is very similar to `useMemo` and `useEffect`. But please notice that the `deps` of `useStore` is **function**.

In addition, we recommend splitting a large Store into small parts, so that not only is the code easier to maintain, but performance can also get improved.
