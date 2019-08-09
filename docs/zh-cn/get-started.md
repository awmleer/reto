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

- 使用各种react hooks定义store，你熟悉的useState、useEffect都在这里
- 简单但高效，极低的学习成本
- 可定义多个store，随用随取
- 基于React Context的依赖注入，简单但不失灵活
- 强类型支持，但同时兼容js环境

## 安装

```bash
$ yarn add reto
# or
$ npm install reto --save
```

## 在线体验

[点此](https://stackblitz.com/edit/reto-demo)可以在线体验demo

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
