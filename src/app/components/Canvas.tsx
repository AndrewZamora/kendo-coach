'use client'
import React, { useEffect, useRef } from 'react'

type Props = {
  height: number,
  width: number,
  draw: (context: CanvasRenderingContext2D) => void,
  mirror?: boolean,
}
function Canvas(props: Props) {
  let ref = useRef<HTMLCanvasElement>(null)

  const { draw, mirror, width, ...rest } = props;


  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    let animationId: number | null = null

    const renderer = () => {
      if (context) {
        draw(context)
      }
      animationId = requestAnimationFrame(renderer)
    }
    renderer()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [draw]);

  return (
    <canvas ref={ref} width={width} {...rest}></canvas>
  )
}

export default Canvas