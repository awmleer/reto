import {useState} from 'react'
import {useStore} from '../..'

export function FooStore() {
  const [x, setX] = useState(1)
  return {
    x,
    setX
  }
}

export function BarStore() {
  const fooStore = useStore(FooStore)
  const [x, setX] = useState(2)
  return {
    x,
    setX,
    fooStore,
  }
}
