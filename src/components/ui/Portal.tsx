import { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'

export function Portal({ children, containerId = 'portal-root' }: { children: React.ReactNode; containerId?: string }) {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    let element = document.getElementById(containerId)
    if (!element) {
      element = document.createElement('div')
      element.id = containerId
      document.body.appendChild(element)
    }
    setContainer(element)

    return () => {
      if (element && element.children.length === 0) {
        element.remove()
      }
    }
  }, [containerId])

  if (!container) return null

  return ReactDOM.createPortal(children, container)
}