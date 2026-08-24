"use client"

import { useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { useRecentlyViewed } from "@lib/hooks/use-recently-viewed"

type RecentlyViewedTrackerProps = {
  product: HttpTypes.StoreProduct
}

export default function RecentlyViewedTracker({
  product,
}: RecentlyViewedTrackerProps) {
  const { addProduct } = useRecentlyViewed()

  useEffect(() => {
    if (product?.id) {
      addProduct(product)
    }
  }, [product, addProduct])

  return null
}
