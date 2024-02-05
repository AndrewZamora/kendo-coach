import React from 'react'

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