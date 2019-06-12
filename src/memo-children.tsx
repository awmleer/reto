import {memo, ReactNode} from 'react'
import React = require('react');

interface Props {
  symbol: Symbol
  children: ReactNode
}

export const MemoChildren = memo<Props>(function MemoChildren(props) {
  return (
    <>{props.children}</>
  )
}, (prevProps, nextProps) => prevProps.symbol === nextProps.symbol)
