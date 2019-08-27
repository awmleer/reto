# Reto

[![GitHub](https://img.shields.io/github/license/awmleer/reto.svg?logo=github)](https://github.com/awmleer/reto)
[![codecov](https://img.shields.io/codecov/c/github/awmleer/reto/master?logo=codecov)](https://codecov.io/gh/awmleer/reto)
[![npm version](https://img.shields.io/npm/v/reto.svg?logo=npm)](https://www.npmjs.com/package/reto)
[![npm downloads](https://img.shields.io/npm/dw/reto.svg?logo=npm)](https://www.npmjs.com/package/reto)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/reto.svg?logo=javascript)](https://www.npmjs.com/package/reto)
[![Build Status](https://img.shields.io/travis/awmleer/reto/master?logo=travis-ci)](https://travis-ci.org/awmleer/reto)
[![codacy](https://img.shields.io/codacy/grade/2d15789ec7b1424092ed472f449a0a70?logo=codacy)](https://app.codacy.com/app/awmleer/reto)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/reto?logo=snyk)](https://app.snyk.io/test/github/awmleer/reto?targetFile=package.json)
![React](https://img.shields.io/npm/dependency-version/reto/peer/react?logo=react)

```
             ___                  __ 
            / _ \___    ___ _____/ /_
           / , _/ -_)  / _ `/ __/ __/
   ____   /_/|_|\__/   \_,_/\__/\__/ 
  / __/  / /____     _______         
 _\ \   / __/ _ \   / __/ -_)        
/___/   \__/\___/  /_/  \__/         
                                     
```

Flexible and efficient React Store with hooks.

## Features

- Supports all react hooks. Writing a store is just like writing a component.
- Simple but efficient, quite easy to learn.
- Use multiple stores to organize your data.
- Dependency injection based on React Context.
- Strongly typed with Typescript, also works well with JS.

## Docs

[English](https://reto.js.org/#/) | [中文](https://reto.js.org/#/zh-cn/)

## Install

```bash
$ yarn add reto
# or
$ npm install reto --save
```

## Try It Online

Click [here](https://stackblitz.com/edit/reto-demo) to try it online.

## A Simple Example

Every `Store` is a function similar to a custom hook. In the body of a `Store` function, you can use any react hooks, for example, `useState`, `useEffect`, `useRef`.

```jsx
export function FooStore() {
  const [x, setX] = useState(initial)
  return {
    x,
    setX
  }
}
```

Then, you can provide a store "instance" using `Provider` component.

```jsx
import {Provider} from 'reto'

<Provider of={FooStore}>
  <App/>
</Provider>
```

By using the `useStore` hook, you can retrieve the store "instance" in components, and subscribe to its changes. 

```jsx
import {useStore} from 'reto'

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

So when you click the "Change" button, the `setX` function of `fooStore` is executed, thereby triggers the update of state `x` and the rerender of `App` component. Everything is simple and straightforward.
