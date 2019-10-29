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

## 如何解决Store频繁更新所导致的性能问题

解决性能问题有以下几种思路：

### 避免Provider的冗余更新

当父组件重渲染时，其中的`Provider`会跟着重新进行渲染，Store Hook也会被重新执行，最终导致订阅了Store的组件也被重新渲染，这种级联性的更新往往会造成非常大的性能损耗。

```jsx
function App(props) {
  return (
    <Provider of={FooStore} args=[10]>
      {props.children}
    </Provider>
  )
}
```

所幸reto为`Provider`提供了`memo`属性，可以避免掉`Provider`的冗余更新。

```jsx
function App(props) {
  return (
    <Provider of={FooStore} args=[10] memo>
      {props.children}
    </Provider>
  )
}
```

当开启`memo`时，`Provider`会对新旧`args`数组进行一次浅比较，如果没有变化，则会跳过这一次的重渲染。

> 绝大多数情况下，我们都推荐开启`memo`，这对性能的提升非常直接且有效。

### 选择性订阅

`useStore`支持传入一个额外的`deps`函数，来控制是否进行组件的重渲染：

```jsx
const fooStore = useStore(FooStore, store => [store.x > 10, store.x < 20])
```

这和`useMemo`、`useEffect`的`deps`非常相似，但是，`useStore`的`deps`参数是一个**函数**。

### 拆分Store

我们建议对一个庞大的Store进行拆分，这样不仅代码更易于维护，性能也会有所改善。
