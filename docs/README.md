# Reto

简单而高效的React Store

## 特性

- 基于React Context的依赖注入，简单但不失灵活
- 基于[immer](https://github.com/immerjs/immer)的state变更操作，copy on write！
- 强类型支持，但同时兼容js环境

## 安装及配置

### 安装依赖

```bash
$ yarn add reto
# or
$ npm install reto --save
```

### 启用修饰器

reto的使用需要用到修饰器语法，js和ts环境下的修饰器启用方法分别如下：

#### JavaScript

使用`@babel/plugin-proposal-decorators`：

https://babeljs.io/docs/en/babel-plugin-proposal-decorators

#### TypeScript

在`tsconfig.json`中，加入如下配置：

```js
{
  "compilerOptions": {
    "experimentalDecorators": true,
    //...
  },
  //...
}
```

## 样例

```typescript
@store
export class FooStore extends Store {
  state = {
    counter: 1
  }
  resetCounter = () => {
    this.mutate(draft => {
      draft.counter = 0
    })
  }
}

@store
export class BarStore extends Store {
  state = {}
  @inject(FooStore) fooStore
}
```

```jsx
export const App = (props) => {
  const barStore = useStore(BarStore)
  const {fooStore} = barStore
  
  function increase() {
    fooStore.mutate(draft => {
      draft.counter++
    })
  }
  return (
    <div>
      <button onClick={increase}>Increase</button>
      <button onClick={fooStore.resetCounter}>Reset</button>
      {fooStore.state.counter}
    </div>
  )
}
```

```jsx
<Provider of={FooStore}>
  <Provider of={BarStore}>
    <App/>
  </Provider>
</Provider>
```

