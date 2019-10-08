import {useState} from 'react'
import {useStore} from '../..'

interface Params {
  initial: number
}

export function FooStore({initial = 1}: Params) {
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
