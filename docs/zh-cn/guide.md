## 创建一个Store

在reto中，Store本质上就是**函数**，在这个函数中，我们可以调用任何react hooks：

```jsx
export function CounterStore() {
  const [count, setCount] = useState(1)
  
  useEffect(() => {
    console.log('x is updated.')
  }, [count])

  function increase() {
    setCount(count + 1)
  }
  
  return {
    count,
    increase,
  }
}
```

理论上，Store的返回值可以是任何类型，但通常，我们建议**把数据和操作函数包装成一个object再进行返回**。

如果你写过[custom hook](https://reactjs.org/docs/hooks-custom.html)，那么上面这个函数你一定不会感到陌生。如果把函数的名字改为`useCounter`，它就变成了一个不折不扣的custom hook。

另一种理解是，把store视作成一个特殊的react函数组件，它和react函数组件的区别主要是：1. 没有props 2. 返回值不是react node。

## 提供一个Store的实例

使用`Provider`组件可以创建并提供一个Store的实例。

> 准确的讲，Store是函数，是没有所谓的"实例"概念的，这里这样表述只是为了便于理解。

```jsx
import {Provider} from 'reto'

<Provider of={CounterStore}>
  <App/>
</Provider>
```

每一个`Provider`组件都会创建出一个独立的"**沙箱环境**"，并在这个"沙箱"中执行Store函数。

## 获取一个Store的实例

使用`useStore`可以在组件中获取到Store的实例，并且同时**订阅更新**。

```jsx
import {useStore} from 'reto'

const App: FC = (props) => {
  const counterStore = useStore(CounterStore)
  
  return (
    <div>
      <button onClick={counterStore.increase}>Increase</button>
      {counterStore.count}
    </div>
  )
}
```

> `useStore`本质上就是react的`useContext`。

## 多层级的Store树

Reto在底层使用的是React的context API，因此可以创建出**多层级**的Store树。

```
─ Provider of FooStore -> 记为实例A
  ├─ Cosumer of FooStore -> 拿到的是实例A
  └─ Provider of FooStore -> 记为实例B
     └─ Consumer of FooStore -> 拿到的是实例B
```

虽然两个`Provider`都是提供的`FooStore`，但是他们之间的数据是彼此完全**隔离**的。

而组件在消费Store时，会在组件树中**就近获取**实例。

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

同时，Reto会将其作为本Store的**依赖**。因此，当`FooStore`更新时，`BarStore`也会自动跟着更新。
