# Reto

简单而高效的React Store

## 特性

- 使用原生的react hooks定义store，你喜欢的useState、useEffect都在这里
- 可定义多个store，随用随取
- 基于React Context的依赖注入，简单但不失灵活
- 基于[immer](https://github.com/immerjs/immer)的state变更操作，copy on write（🚧正在完善）
- 强类型支持，但同时兼容js环境

## 安装及配置

### 安装依赖

```bash
$ yarn add reto
# or
$ npm install reto --save
```

## 一个简单的样例

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

```jsx
<Provider of={FooStore}>
  <App/>
</Provider>
```

