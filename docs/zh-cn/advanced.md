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

## 多层级的Store树

Reto在底层使用的是React的context API，因此可以创建出多层级的Store树。

```
- Provider of FooStore -> 记为实例A
  |- Cosumer of FooStore -> 拿到的是实例A
  |- Provider of FooStore -> 记为实例B
     |- Consumer of FooStore -> 拿到的是实例B
```

## Store之间的依赖

你可以在一个Store的函数体中使用`useStore`来引入另一个Store：

```jsx
export function BarStore() {
  const fooStore = useStore(FooStore)
  const [x, setX] = useState(2)
  return {
    x,
    setX,
    fooStore,
  }
}
```

同时，Reto会将其作为本Store的依赖。因此，当`FooStore`更新时，`BarStore`也会自动跟着更新。

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
})(YourComponent)
```

当然，你还可以基于`withProvider`创建自己的高阶组件：

```js
const provideFooStore = withProvider({
  of: FooStore
})

export const App = provideFooStore((props) => {
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

`useStore`在底层是使用的`useContext`，因此，关于这个问题的处理方案，可以参照[这里](https://github.com/facebook/react/issues/15156#issuecomment-474590693)。
