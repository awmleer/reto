## Create a Store

In reto, a Store is essentially a **function**, and we can call any react hooks in it:

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

Theoretically, store can return a value of any type. However, we recommend **wrap data and operation functions into an object**, and then return this object.

You'll be quite familiar with the function above if you have written a [custom hook](https://reactjs.org/docs/hooks-custom.html) before. If we change the name of this function into `useCounter`, then it'll just be a custom hook.

There is another way to understand it: You can regard a store as a special react component. While there are some difference between a store function and a react function component: 1. No props. 2. The return value is not a react node.

## Provide a Store Instance

You can provide a store "instance" using the `Provider` component.

> To be precise, a store is a function, so there is no "instance". Describing in this way is just for ease of understanding.

```jsx
import {Provider} from 'reto'

<Provider of={CounterStore}>
  <App/>
</Provider>
```

Every `Provider` component creates a standalone "**sandbox environment**", and execute the store function in this sandbox.

## Get the Store Instance


By using the `useStore` hook, you can retrieve the store "instance" in components, and **subscribe** to its changes.

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

> Actually, `useStore` is `useContext` under the hood.

## Hierarchical Store Tree

Reto uses React's Context API under the hood. Thereby, you can create a **hierarchical** store tree.

```
─ Provider of FooStore -> mark as instance A
  ├─ Cosumer of FooStore -> we got instance A
  └─ Provider of FooStore -> mark as instance B
     └─ Consumer of FooStore -> we got instance B
```

Each of the two `Provider`s provides an instance of `FooStore`, and the data are **isolated** completely.

When a component consumes this Store, it will fetch an instance from the nearest `Provider`.

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
