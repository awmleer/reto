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

There are several ways to solve the performance issuse:

### Eliminate Redundant Updates of Provider

When the parent component re-renders, the `Provider` component in it will also re-render, therefore the Store Hook will be re-executed. And finally, all the components subscribed to this Store will be re-rendered. This kind of cascading update will often result in dramatically performance cost.

```jsx
function App(props) {
  return (
    <Provider of={FooStore} args=[10]>
      {props.children}
    </Provider>
  )
}
```

Fortunately, reto provides the `memo` props for `Provider`, which can be enabled to avoid redundant updates of `Provider`.

```jsx
function App(props) {
  return (
    <Provider of={FooStore} args=[10] memo>
      {props.children}
    </Provider>
  )
}
```

When `memo` is turned on, `Provider` will perform a shallow comparison of the old and new `args` arrays. If there is no change, this update will be skipped.

> In most cases, we recommend turning on `memo`, which is very straightforward and effective for performance optimization.

### Partial Subscription

If a store is too big or it updates too frequently, there may be a performance issue.

You can pass an additional `deps` function to `useStore` for controlling whether to rerender.

```jsx
const fooStore = useStore(FooStore, store => [store.x, store.y[0]])
```

This is very similar to `useMemo` and `useEffect`. But please notice that the `deps` of `useStore` is **function**.

### Split Store

We recommend splitting a large Store into small parts, so that not only is the code easier to maintain, but performance can also get improved.

## Default Value

You can set the `defaultValue` property on Store functions. When there is no `Provider`, `useStore` will use this `defaultValue`.

```jsx
function FooStore() {
  const [x, setX] = useState(1)
  return {x, setX}
}
FooStore.defaultValue = {x: 0}

function App() {
  const fooStore = useStore(FooStore)
  console.log(fooStore) // {x: 0}
  //...
}
```
