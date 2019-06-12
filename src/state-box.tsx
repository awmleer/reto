import {memo} from 'react'

interface Props {
  useStore: Function
  args?: any[]
  onChange: (value: any) => void
}

export const StateBox = memo<Props>(function Reactor(props) {
  const store = props.args ? props.useStore(...props.args) : props.useStore()
  props.onChange(store)
  return null
})
