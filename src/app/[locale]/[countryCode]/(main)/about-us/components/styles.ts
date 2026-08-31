import type { CSSProperties } from "react"

export const satoshiStyle: CSSProperties = {
  fontFamily: "Satoshi, sans-serif",
}

export const caveatStyle: CSSProperties = {
  fontFamily: "var(--font-caveat), cursive",
}

export type Props = {
  isRTL: boolean
  locale: string
}
