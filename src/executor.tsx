import {FC, memo} from 'react'
import {Store, StoreP, StoreV} from './store'

interface Props {
  useStore: Store
  onChange: (value: StoreV<Store>) => void
  args?: StoreP<Store>
  memo?: boolean
}

export const Executor: FC<Props> = memo((props) => {
  props.onChange((props.args ? props.useStore(...props.args) : props.useStore()))
  return null
}, (prevProps, nextProps) => {
  if (!nextProps.memo) {
    return false
  } else {
    return argsAreEqual(prevProps.args, nextProps.args)
  }
})

function argsAreEqual(args1: unknown[] | undefined, args2: unknown[] | undefined) {
  if (args1 === args2) return true
  if (args1.length !== args2.length) return false
  return args1.every((element, index) => element === args2[index])
}
