import {memo} from 'react'
import {Store} from './store'

interface Props {
  useStore: Store<unknown>
  args?: any[]
  onChange: (value: any) => void
}

export const StateBox = memo<Props>(function StateBox(props) {
  const store = props.args ? props.useStore(...props.args) : props.useStore()
  props.onChange(store)
  return null
}, (prevProps, nextProps) => prevProps.useStore === nextProps.useStore)
