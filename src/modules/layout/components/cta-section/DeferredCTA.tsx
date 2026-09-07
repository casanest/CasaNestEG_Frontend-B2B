"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

const SETTLE_MS = 200
const MAX_WAIT_MS = 3000

export default function DeferredCTA({
  children,
}: {
  children: React.ReactNode
}) {
  const [show, setShow] = useState(false)
  const pathname = usePathname()
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const deadlineTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafId = useRef<number | null>(null)

  const clearPending = () => {
    if (settleTimer.current) {
      clearTimeout(settleTimer.current)
      settleTimer.current = null
    }
    if (deadlineTimer.current) {
      clearTimeout(deadlineTimer.current)
      deadlineTimer.current = null
    }
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }

  const reveal = () => {
    clearPending()
    rafId.current = requestAnimationFrame(() => {
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null
        setShow(true)
      })
    })
  }

  const scheduleSettle = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(reveal, SETTLE_MS)
  }

  const hide = () => {
    clearPending()
    setShow(false)
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return

      const anchor = (e.target as HTMLElement | null)?.closest?.(
        "a"
      ) as HTMLAnchorElement | null
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return

      const href = anchor.getAttribute("href")
      if (
        !href ||
        href.startsWith("#") ||
        /^(https?:|mailto:|tel:)/i.test(href)
      )
        return

      hide()
    }

    window.addEventListener("click", onClick, true)
    window.addEventListener("popstate", hide)
    return () => {
      window.removeEventListener("click", onClick, true)
      window.removeEventListener("popstate", hide)
      clearPending()
    }
  }, [])

  const firstPathname = useRef(true)
  useEffect(() => {
    if (firstPathname.current) {
      firstPathname.current = false
      return
    }
    hide()
  }, [pathname])

  useEffect(() => {
    if (show) return

    const observer = new MutationObserver(scheduleSettle)
    observer.observe(document.body, { childList: true, subtree: true })

    scheduleSettle()
    deadlineTimer.current = setTimeout(reveal, MAX_WAIT_MS)

    return () => {
      observer.disconnect()
      clearPending()
    }
  }, [show])

  if (!show) return null
  return <>{children}</>
}
