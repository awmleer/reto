import {memo, ReactNode} from 'react'
import * as React from 'react'

interface Props {
  flag: {}
  children: ReactNode
}

export const MemoChildren = memo<Props>(function MemoChildren(props) {
  return (
    <>{props.children}</>
  )
}, (prevProps, nextProps) => prevProps.flag === nextProps.flag)
