import * as React from 'react'
import {FC} from 'react'
import {useStore} from '../..'
import {BarStore, FaaStore, FooStore} from '../stores/foo.store'

export const ShowFoo: FC = () => {
  const fooStore = useStore(FooStore)
  return (
    <div>
      {fooStore.foo}
    </div>
  )
}

export const ShowFaa: FC = () => {
  const faaStore = useStore(FaaStore)
  return (
    <div>
      {faaStore.faa}
    </div>
  )
}

export const ShowBar: FC = () => {
  const barStore = useStore(BarStore)
  return (
    <div>
      {barStore.fooStore.foo}
    </div>
  )
}
