import {useState} from 'react'
import {useStore} from '../..'

export function FooStore(initial: number = 1) {
  const [x, setX] = useState(initial)
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
