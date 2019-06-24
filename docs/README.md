# Reto

```
             ___                  __ 
            / _ \___    ___ _____/ /_
           / , _/ -_)  / _ `/ __/ __/
   ____   /_/|_|\__/   \_,_/\__/\__/ 
  / __/  / /____     _______         
 _\ \   / __/ _ \   / __/ -_)        
/___/   \__/\___/  /_/  \__/         
                                     
```

简单而高效的React Store

## 特性

- 使用各种react hooks定义store，你熟悉的useState、useEffect都在这里
- 可定义多个store，随用随取
- 基于React Context的依赖注入，简单但不失灵活
- 强类型支持，但同时兼容js环境

## 安装

```bash
$ yarn add reto
# or
$ npm install reto --save
```

## 一个简单的例子

每一个`Store`其实就是一个类似于custom hook的函数。在`Store`的函数体中，你可以随意使用react hooks，例如`useState`、`useEffect`、`useRef`。

```jsx
export function FooStore() {
  const [x, setX] = useState(initial)
  return {
    x,
    setX
  }
}
```

通过`Provider`组件提供一个`FooStore`。

```jsx
<Provider of={FooStore}>
  <App/>
</Provider>
```

在组件中通过`useStore`获取并订阅`FooStore`的更新。

```jsx
const App: FC = (props) => {
  const fooStore = useStore(FooStore)
  
  function changeStore() {
    fooStore.setX(fooStore.x + 1)
  }
  return (
    <div>
      <button onClick={changeStore}>Change</button>
      {fooStore.x}
    </div>
  )
}
```

当点击按钮时，会调用`fooStore`中的`setX`函数，从而触发`x`的更新以及`App`组件的重渲染，一切都非常简单而自然。

## 进阶用法

### 传递参数给Store

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

### 多层级的Store树

Reto在底层使用的是React的context API，因此可以创建出多层级的Store树。

```
- Provider of FooStore -> 记为实例A
  |- Cosumer of FooStore -> 拿到的是实例A
  |- Provider of FooStore -> 记为实例B
     |- Consumer of FooStore -> 拿到的是实例B
```

### Store之间的依赖

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

### 使用immer

使用[immer](https://github.com/immerjs/immer)可以在某些时候简化`setState`的语法，详细用法可以参考其官方文档上的[介绍](https://github.com/immerjs/immer#reactsetstate-example)。

### 使用useReducer

当Store变得非常复杂时，可以通过`useReducer`更好的组织逻辑。详见[文档](https://reactjs.org/docs/hooks-reference.html#usereducer)。

### 使用useAction

由于`useEffect`是会延后执行的，因此在Reto中，[useAction](https://github.com/awmleer/use-action)是一个更适合的替代品。

> Unlike componentDidMount and componentDidUpdate, the function passed to useEffect fires after layout and paint, during a deferred event. This makes it suitable for the many common side effects, like setting up subscriptions and event handlers, because most types of work shouldn’t block the browser from updating the screen.

### 使用useCreation

[useCreation](https://github.com/awmleer/use-creation)是`useMemo`的替代品，因为`useMemo`不能保证被memo的值一定不会被重计算。

> **You may rely on useMemo as a performance optimization, not as a semantic guarantee.**In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

### 使用Rx.js

Rx.js非常适合事件通知的逻辑，在Reto中，可以配合`useCreation`使用Rx.js：

```jsx
export function FooStore() {
  const event$ = useCreation(() => new Subject()) // 使用useCreation来避免重复创建Subject

  function notify(data) {
    event$.next(data)
  }

  return {
    opened$,
    notify,
  }
}
```



