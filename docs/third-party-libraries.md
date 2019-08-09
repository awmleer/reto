## useMemo

If you are familiar with vue's `computed` feature, `useMemo` can help you to solve similar problems.

## useAsyncMemo

[useAsyncMemo](https://github.com/awmleer/use-async-memo) is very suitable for handling asynchronous computed data, for example, fetching paginated data or calling search API when input changes.

## immer

[immer](https://github.com/immerjs/immer) is a tiny package that allows you to work with immutable state in a more convenient way. You can see [here](https://github.com/immerjs/immer#reactsetstate-example) for more information.

## useAction

the function passed to `useEffect` fires after layout and paint, during a deferred event. If you need to execute the effect function immediately, you can use [useAction](https://github.com/awmleer/use-action) in replacement. 

> Unlike componentDidMount and componentDidUpdate, the function passed to useEffect fires after layout and paint, during a deferred event. This makes it suitable for the many common side effects, like setting up subscriptions and event handlers, because most types of work shouldn’t block the browser from updating the screen.

## useCreation

[useCreation](https://github.com/awmleer/use-creation) is the replacement for `useMemo` or `useRef`.

`useMemo` can't guarantee the memoized value will not be recalculated, while `useCreation` can guarantee that.

> **You may rely on useMemo as a performance optimization, not as a semantic guarantee.**In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

And similar to `useRef`, you can use `useCreation` to create some constants. But `useCreation` can avoid performance hazards.

```javascript
const a = useRef(new Subject()) //A new Subject instance is created in every render.
const b = useCreation(() => new Subject(), []) //By using factory function, Subject is only instantiated once.
```

## Rx.js

You can use Rx.js to create a event stream. In order to prevent recreating streams, you can use the [useCreation](https://github.com/awmleer/use-creation) hook.
 
```jsx
export function FooStore() {
  const event$ = useCreation(() => new Subject()) // <- Here

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

If you like flux or redux, `useReducer` may be suitable for you. But we don't recommend using it.

