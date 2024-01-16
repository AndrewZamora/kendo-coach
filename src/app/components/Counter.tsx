import React from 'react'

type Angles = {
  armpit?: {
    right: number,
    left: number
  },
  elbow?: {
    right: number,
    left: number
  },
}
type Props = {
  count: number
}
function Counter({ count }: Props) {
  return (
    <>
      <div>{count}</div>
    </>
  )
}

export default Counter