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

## Hierarchical Store Tree

Reto uses React's Context API under the hood. Thereby, you can create a hierarchical store tree.

```
- Provider of FooStore -> mark as instance A
  |- Cosumer of FooStore -> we got instance A
  |- Provider of FooStore -> mark as instance B
     |- Consumer of FooStore -> we got instance B
```

## Dependencies Between Stores

If you want to "inject" `FooStore` store into `BarStore`, you can call `useStore` in the body of `BarStore`.

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

In the mean while, Reto will know `FooStore` is the dependency of BarStore. So whenever `FooStore` updates, `BarStore` will update too. 

## How to Solve the Performance Issue

If a store is too big or it updates too frequently, there may be a performance issue.

Since `useStore` is actually `useContext` under the hood, you can solve this issue by the same way of `useContext`. Please see [this](https://github.com/facebook/react/issues/15156#issuecomment-474590693) for reference.
