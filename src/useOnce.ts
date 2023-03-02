import type { EffectCallback } from 'react'
import { useRef } from 'react'

export const useOnce = (effect: EffectCallback) => {
  const once = useRef(true)

  if (once.current) {
    effect()
    once.current = false
  }
}
