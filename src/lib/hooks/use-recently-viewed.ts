"use client"

import { useCallback, useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"

const STORAGE_KEY = "casanest_recently_viewed"
const MAX_ITEMS = 15

export type RecentlyViewedItem = {
  product: HttpTypes.StoreProduct
  viewedAt: number
}

function readStorage(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && item.product && item.product.id)
  } catch {
    return []
  }
}

function writeStorage(items: RecentlyViewedItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(readStorage())
    setHydrated(true)
  }, [])

  const addProduct = useCallback((product: HttpTypes.StoreProduct) => {
    setItems((prev) => {
      const filtered = prev.filter(
        (item) => item.product && item.product.id !== product.id
      )
      const next = [{ product, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
      writeStorage(next)
      return next
    })
  }, [])

  const removeProduct = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.product && item.product.id !== id)
      writeStorage(next)
      return next
    })
  }, [])

  return { items, hydrated, addProduct, removeProduct }
}
