## 传递参数给Store

可以通过Provider的args属性传递参数给Store：

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

有时，我们需要在一个组件中"同时"提供和使用某个store，例如：

```jsx
export function App(props) {
  const fooStore = useStore(FooStore) // ⚠️在这里拿不到fooStore
  return (
    <Provider of={FooStore}>
      <p>{fooStore.x}</p>
    </Provider>
  )
}
```

我们希望在`App`组件中创建`FooStore`的`Provider`，但又同时想在`App`组件中`useStore(FooStore)`。这时，我们可以使用`withProvider`：

```jsx
export const App = withProvider({
  of: FooStore
})((props) => {
  const fooStore = useStore(FooStore) // 🎉可以正常获取到fooStore了
  return (
    <p>{fooStore.x}</p>
  )
})
```

`withProvider`分为两层，你需要先传给它Provider的属性（将jsx中Provider的props写成object的形式），然后再传给它你想要加工的组件。

```jsx
withProvider({
  of: FooStore,
  args: [42, 'abc'],
})(MyComponent)
```

此外，你还可以传入一个props的**生成函数**。如果你希望根据组件接收到到`props`动态控制传递给`Provider`的`props`，可以使用这种方法。

```jsx
withProvider(props => ({
  of: FooStore,
  args: [42, props.id],
}))(MyComponent)
```

当然，你还可以基于`withProvider`创建自己的高阶组件：

```js
const withFooStoreProvider = withProvider({
  of: FooStore
})

export const App = withFooStoreProvider((props) => {
  //...
})
```

## 在类组件中使用

虽然Reto自身是通过hooks实现的，但是也是支持在类组件中使用的。显然，我们不能在类组件中使用`useStore`，但是Reto提供了可以在类组件中使用的`Consumer`：

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

## 如何解决store频繁更新所导致的性能问题

`useStore`支持传入一个额外的`deps`函数，来控制是否进行组件的重渲染：

```jsx
const fooStore = useStore(FooStore, store => [store.x > 10, store.x < 20])
```

这和`useMemo`、`useEffect`的`deps`非常相似，但是，`useStore`的`deps`参数是一个**函数**。

此外，我们建议对一个庞大的Store进行拆分，这样不仅代码更易于维护，性能也会有所改善。
