"use client"

import React, { useState } from "react"

type OrderItemThumbnailProps = {
  thumbnail: string
  title: string
  className?: string
}

const OrderItemThumbnail: React.FC<OrderItemThumbnailProps> = ({
  thumbnail,
  title,
  className = "w-16 h-16 rounded-md object-cover",
}) => {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0"
        aria-hidden
      />
    )
  }

  return (
    <img
      src={thumbnail}
      alt={title}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}

export default OrderItemThumbnail
