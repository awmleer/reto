# Reto

简单而高效的React Store

## 安装依赖

```bash
$ yarn add reto
# or
$ npm install reto --save
```

## 配置Typescript

在`tsconfig.json`中，加入如下配置：

```js
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    //...
  },
  //...
}
```

## 样例

```typescript
interface State {
  x: number
} 

@store
export class FooStore extends Store<State> {
  state = {
    x: 1
  }
}
```

```jsx
export const App: FC = (props) => {
  const fooStore = useStore(FooStore)
  
  function changeStore() {
    fooStore.mutate(draft => {
      draft.x++
    })
  }
  return (
    <div>
      <button onClick={changeStore}>Change</button>
      {fooStore.state.x}
    </div>
  )
}
```

```jsx
<Provider of={FooStore}>
  <App/>
</Provider>
```

