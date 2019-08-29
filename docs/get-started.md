> **Flexible** and **efficient** React store with hooks.

```
             ___                  __ 
            / _ \___    ___ _____/ /_
           / , _/ -_)  / _ `/ __/ __/
   ____   /_/|_|\__/   \_,_/\__/\__/ 
  / __/  / /____     _______         
 _\ \   / __/ _ \   / __/ -_)        
/___/   \__/\___/  /_/  \__/         
                                     
```

## Features

- Supports all React hooks. Writing a store is just like writing a custom hook.
- Simple but efficient, learn in 10 minutes.
- Use multiple stores to organize your data.
- Dependency injection based on React Context.
- Strongly typed with Typescript, also works well with JS.

## Try It Online

Click [here](https://stackblitz.com/edit/reto-demo) to try it online.

## FAQ

[Here](faq.md) are some frequently asked questions.

## Install

```bash
$ yarn add reto
# or
$ npm install reto --save
```

## A Simple Example

Every `Store` is a function similar to a custom hook. In the body of a `Store` function, you can use any react hooks, for example, `useState`, `useEffect`, `useRef`.

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

Then, you can provide a store "instance" using `Provider` component.

```jsx
import {Provider} from 'reto'

<Provider of={CounterStore}>
  <App/>
</Provider>
```

By using the `useStore` hook, you can retrieve the store "instance" in components, and subscribe to its changes. 

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

So when you click the "Change" button, the `setX` function of `fooStore` is executed, thereby triggers the update of state `x` and the rerender of `App` component. Everything is simple and straightforward.
