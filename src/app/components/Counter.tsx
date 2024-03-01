import React from 'react'

type Props = {
  count: number
}

function Counter({ count }: Props) {
  return (
    <>
      <div className='text-9xl'>Count: {count}</div>
    </>
  )
}

export default Counter