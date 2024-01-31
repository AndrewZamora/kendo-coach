'use client'
import { ElementRef, useEffect, useRef } from 'react'

type Props = {
  draw: (context:CanvasRenderingContext2D) => void,
}

function useCanvas(props: Props) {
  let ref = useRef<ElementRef<'canvas'>>(null)
  const { draw } = props;


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

  return ref
}

export default useCanvas