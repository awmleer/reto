基于hooks的React Store，灵活而高效。

```
             ___                  __ 
            / _ \___    ___ _____/ /_
           / , _/ -_)  / _ `/ __/ __/
   ____   /_/|_|\__/   \_,_/\__/\__/ 
  / __/  / /____     _______         
 _\ \   / __/ _ \   / __/ -_)        
/___/   \__/\___/  /_/  \__/         
                                     
```


## 特性

- 支持全部的React Hooks，写Store就像写Custom Hook
- 简单但高效，10分钟快速上手
- 从此告别单一状态树，可定义多个store，随用随取
- 基于React Context的依赖注入
- 强类型支持，但同时兼容js环境

## 在线体验

<iframe src="https://codesandbox.io/embed/github/awmleer/reto-demo/tree/master/?fontsize=14&codemirror=1&view=split" title="react" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## 常见问题

[这里](https://)是一些常见的问题。

## 安装

```bash
$ yarn add reto
# or
$ npm install reto --save
```

## 一个简单的例子

每一个`Store`其实就是一个类似于custom hook的函数。在`Store`的函数体中，你可以随意使用react hooks，例如`useState`、`useEffect`、`useRef`。

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

通过`Provider`组件提供一个`FooStore`的"实例"。

```jsx
import {Provider} from 'reto'

<Provider of={CounterStore}>
  <App/>
</Provider>
```

在组件中通过`useStore`获取并订阅`FooStore`的更新。

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

当点击按钮时，会调用`fooStore`中的`setX`函数，从而触发`x`的更新以及`App`组件的重渲染，一切都非常简单而自然。
