import type { FC, PropsWithChildren, Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useRef, useState, useEffect } from 'react'
import { Lrud, Orientation } from 'lrud'

/**
 * State of the navigation context
 */
interface NavigationState {
  /** lrud instance, represents the nav tree */
  lrud: Lrud
  /** Reference to the focused DOM node */
  focused: HTMLElement | null
  /** Sets the focused DOM node */
  focus: Dispatch<SetStateAction<HTMLElement | null>>
}

const NavigationContext = createContext<NavigationState>({
  lrud: new Lrud(),
  focused: null,
  focus: () => void 0,
})

export const useNavigation = () => useContext(NavigationContext)

interface Props extends PropsWithChildren {
  /** Orientation of the root node */
  orientation?: Orientation
}

export const Navigation: FC<Props> = ({ children, orientation }) => {
  const lrud = useRef<Lrud>(new Lrud().registerNode('root', { orientation }))
  const [focused, focus] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const onkeydown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
          event.preventDefault()
      }

      lrud.current.handleKeyEvent(event)
    }

    window.addEventListener('keydown', onkeydown)

    return () => {
      window.removeEventListener('keydown', onkeydown)
    }
  }, [])

  useEffect(() => {
    focused?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }, [focused])

  return (
    <NavigationContext.Provider value={{ lrud: lrud.current, focused, focus }}>
      {children}
    </NavigationContext.Provider>
  )
}
