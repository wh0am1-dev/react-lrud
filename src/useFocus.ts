import { useId, useRef, useCallback } from 'react'
import { NodeConfig } from 'lrud'
import { useNavigation } from './Navigation'
import { useOnce } from './useOnce'

/**
 * Focusable node state
 */
interface FocusableNode<T extends HTMLElement> {
  /** ID of the node */
  id: string
  /** Reference to the DOM node using the focus */
  ref: (element: T) => void
  /** Determines whether the node is focused or not */
  isFocused: boolean
  /** Focus this node in the navigation tree */
  assignFocus: () => void
  /** Unregister node in the navigation tree */
  unregister: () => void
}

/**
 * Registers a focusable node in the navigation tree
 */
export const useFocus = <T extends HTMLElement>(
  /**
   * lrud config for the node.
   * docs: https://github.com/bbc/lrud/blob/HEAD/docs/usage.md#registration-options
   */
  config: NodeConfig = {}
): FocusableNode<T> => {
  const id = useId()
  const { lrud, focused, focus } = useNavigation()

  const elementRef = useRef<T | null>(null)
  const ref = useCallback(
    (element: T) => {
      if (element) {
        try {
          lrud.registerNode(id, {
            ...config,
            onFocus: node => {
              config.onFocus?.(node)
              element.focus()
              focus(element)
            },
          })
        } catch (error) {
          console.warn(error)
        }
      }
    },
    [id, lrud, focus]
  )

  const isFocused = !!elementRef.current && elementRef.current === focused

  const assignFocus = useCallback(() => {
    try {
      lrud.assignFocus(id)
    } catch (error) {
      console.warn(error)
    }
  }, [id, lrud])

  const unregister = useCallback(() => lrud.unregisterNode(id), [id, lrud])

  useOnce(() => {
    if (!config.isFocusable) {
      try {
        lrud.registerNode(id, {
          ...config,
          onFocus: node => config.onFocus?.(node),
        })
      } catch (error) {
        console.warn(error)
      }
    }
  })

  return { id, ref, isFocused, assignFocus, unregister }
}
