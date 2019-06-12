import {memo} from 'react'

interface Props {
  useStore: Function
  onChange: (value: any) => void
}

export const Reactor = memo<Props>(function Reactor(props) {
  const store = props.useStore()
  props.onChange(store)
  return null
})
