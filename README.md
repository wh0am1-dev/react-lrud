# 🚢 react-lrud

react lib for keyboard navigation

## usage

first, wrap your app with the `Navigation` context

```tsx
import { createRoot } from 'react'
import { Navigation } from 'react-lrud'

const App = () => (
  <Navigation>
    <Home />
  </Navigation>
)

createRoot(document.querySelector('#root')).render(<App />)
```

then, register nodes using the `useFocus` hook  
take a look at [lrud's docs](https://github.com/bbc/lrud/blob/HEAD/docs/usage.md#registration-options) for reference about the config

```tsx
import { useEffect } from 'react'
import { useFocus } from 'react-lrud'

const Link = ({ parent, href, children }) => {
  const { ref, isFocused, assignFocus } = useFocus<HTMLAnchorElement>({
    parent,
    isFocusable: true,
  })

  return (
    <a
      ref={ref}
      href={href}
      onMouseEnter={assignFocus}
      styles={{ color: isFocused ? '#ffb700' : '#e0e0e0' }}
    >
      {children}
    </a>
  )
}

const Navbar = ({ parent, links }) => {
  const { id } = useFocus({ parent, orientation: 'horizontal' })

  return (
    <nav>
      <ul>
        {links.map(link => (
          <li key={link.href}>
            <Link parent={id} href={link.href}>
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const Home = () => {
  const { id } = useFocus({ orientation: 'vertical' })

  return (
    <Navbar
      parent={id}
      links={[
        { title: 'home', href: '/' },
        { title: 'search', href: '/search' },
        { title: 'settings', href: '/settings' },
      ]}
    />
  )
}
```
