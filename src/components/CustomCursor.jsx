import { useState, useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current

    const onMouseMove = (e) => {
      if (!visible) setVisible(true)
      cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`
    }

    const onMouseOver = (e) => {
      const el = e.target
      const computed = window.getComputedStyle(el)
      const isClickable =
        el.tagName === 'A' ||
        el.tagName === 'BUTTON' ||
        el.closest('a') ||
        el.closest('button') ||
        computed.cursor === 'pointer'
      setIsPointer(isClickable)
    }

    const onMouseLeave = () => setVisible(false)
    const onMouseEnter = () => setVisible(true)

    // R3F sets cursor inline styles on canvas elements on every pointer event.
    // Use a MutationObserver to immediately force them back to 'none'.
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'style') {
          const el = m.target
          if (el.style.cursor && el.style.cursor !== 'none') {
            el.style.cursor = 'none'
          }
        }
      }
    })

    // Observe all canvas elements (current and future)
    const observeCanvases = () => {
      document.querySelectorAll('canvas').forEach((canvas) => {
        canvas.style.cursor = 'none'
        observer.observe(canvas, { attributes: true, attributeFilter: ['style'] })
      })
    }
    observeCanvases()

    // Also observe body for the same reason
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })

    // Re-observe if new canvases are added to the DOM
    const bodyObserver = new MutationObserver(() => observeCanvases())
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
      observer.disconnect()
      bodyObserver.disconnect()
    }
  }, [visible])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor${isPointer ? ' custom-cursor--pointer' : ''}`}
      style={{ opacity: visible ? 1 : 0 }}
    />
  )
}
