import {memo} from 'react'
import {Store} from './store'

interface Props {
  useStore: Store<unknown>
  args?: unknown[]
  onChange: (value: unknown) => void
}

export const StateBox = memo<Props>(function StateBox(props) {
  const store = props.args ? props.useStore(...props.args) : props.useStore()
  props.onChange(store)
  return null
}, (prevProps, nextProps) => {
  if (prevProps.useStore !== nextProps.useStore) {
    return false
  }
  if (prevProps.args.length !== nextProps.args.length) {
    return false
  }
  for (let index in nextProps.args) {
    if (prevProps.args[index] !== nextProps.args[index]) {
      return false
    }
  }
  return true
})
