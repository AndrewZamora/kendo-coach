import React from 'react'

type Props = {
  count: number
}

function Counter({ count }: Props) {
  return (
    <>
      <div>Count: {count}</div>
    </>
  )
}

export default Counter