## useMemo

如果你熟悉vue的`computed`特性，那么`useMemo`可以帮助你解决类似的问题。

## useAsyncMemo

[useAsyncMemo](https://github.com/awmleer/use-async-memo)非常适合用来处理异步的计算数据，它对于`useMemo`是一个很好的补充。例如在翻页（`pageNumber`变化）时调用API加载远程数据。

## withWrapper

如果你在一个组件中创建了一个`FooStore`的`Provider`，那么是无法同时在这个组件通过`useStore(FooStore)`来获取这个Store的实例的：

```jsx
const App = function() {
  const fooStore = useStore(FooStore) // 这里是获取不到 FooStore 实例的
  return (
    <Provider of={FooStore}>
      <p>Hello.</p>
    </Provider>
  )
}
```

为了解决这个问题，可以使用[withWrapper](https://github.com/awmleer/with-wrapper)：

```jsx
const App = withWrapper(element => (
  <Provider of={FooStore}>
    {element}
  </Provider>
))(function() {
  const fooStore = useStore(FooStore) // 现在这里可以获取到 FooStore 实例了
  return (
    <p>Hello.</p>
  )
})
```

## immer

使用[immer](https://github.com/immerjs/immer)可以在某些时候简化`setState`的语法，详细用法可以参考其官方文档上的[介绍](https://github.com/immerjs/immer#reactsetstate-example)。

## useAction

由于`useEffect`是会延后执行的，因此在Reto中，[useAction](https://github.com/awmleer/use-action)是一个更适合的替代品。

> Unlike componentDidMount and componentDidUpdate, the function passed to useEffect fires after layout and paint, during a deferred event. This makes it suitable for the many common side effects, like setting up subscriptions and event handlers, because most types of work shouldn’t block the browser from updating the screen.

## useCreation

[useCreation](https://github.com/awmleer/use-creation)是`useMemo`或`useRef`的替代品。

因为`useMemo`不能保证被memo的值一定不会被重计算，而`useCreation`可以保证这一点。

> **You may rely on useMemo as a performance optimization, not as a semantic guarantee.**In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

而相比于`useRef`，你可以使用`useCreation`创建一些常量，这些常量和`useRef`创建出来的ref有很多使用场景上的相似，但对于复杂常量的创建，`useRef`却容易出现潜在的性能隐患。

```javascript
const a = useRef(new Subject()) //每次重渲染，都会执行实例化Subject的过程，即便这个实例立刻就被扔掉了
const b = useCreation(() => new Subject(), []) //通过factory函数，可以避免性能隐患
```

## Rx.js

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

## useReducer

当Store变得非常复杂时，可以通过`useReducer`更好的组织逻辑。详见[文档](https://reactjs.org/docs/hooks-reference.html#usereducer)。不过笔者并不非常推荐使用它，因为当组件变得过于庞大时，更好的办法是进行拆分。
