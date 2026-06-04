"use client"
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import {
  normalizeProductImageUrl,
  shouldUseUnoptimizedImage,
} from "@lib/util/product-image-url"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  activeIndex?: number // ✅ جديد
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  activeIndex = 0, // ✅ جديد
  "data-testid": dataTestid,
}) => {
  const allImages = images?.length
    ? images
        .filter((img): img is { url: string } => Boolean(img?.url))
        .map((img) => ({ url: normalizeProductImageUrl(img.url) }))
    : thumbnail
      ? [{ url: normalizeProductImageUrl(thumbnail) }]
      : []
  const currentImage = allImages[activeIndex]?.url || null

  const aspectRatio = (() => {
    if (isFeatured) return "aspect-[1678/2098]"
    if (size === "square") return "aspect-[1/1]"
    if (size === "small") return "aspect-[1678/2098]"
    if (size === "medium") return "aspect-[1678/2098]"
    if (size === "large") return "aspect-[1678/2098]"
    return "aspect-[1678/2098]"
  })()

  const maxHeight = (() => {
    if (size === "medium") return "max-h-[360px]"
    if (size === "large") return "max-h-[420px]"
    return ""
  })()

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-0  ",
        aspectRatio,
        maxHeight,
        className
      )}
      data-testid={dataTestid}
    >
      {currentImage ? (
        <div className="absolute inset-0 ">
          <div className="relative w-full h-full">
            <Image
              src={currentImage}
              alt="Product Image"
              className="absolute inset-0 object-contain object-center transition-opacity duration-500 ease-in-out"
              draggable={false}
              quality={70}
              sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 280px"
              fill
              unoptimized={shouldUseUnoptimizedImage(currentImage)}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center ">
          <PlaceholderImage size={size === "small" ? 16 : 24} />
        </div>
      )}
    </Container>
  )
}


const ImageOrPlaceholder = ({
  image,
  size,
  isSecondary, 
  hasSecondary
}: Pick<ThumbnailProps, "size"> & {
  image?: string;
  isSecondary: boolean;
  hasSecondary?: boolean;
}) => {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [image])

  const showPlaceholder = !image || imageError

  if (showPlaceholder && !isSecondary) {
    return (
      <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-gray-100">
        <PlaceholderImage size={size === "small" ? 16 : 24} />
      </div>
    )
  }

  if (showPlaceholder && isSecondary) return null

  const src = normalizeProductImageUrl(image as string)

  return (
    <Image
      src={src}
      alt="Product Image"
      className={clx(
        "absolute inset-0 object-contain object-center transition-all duration-700 ease-in-out",
        {
          // تنسيق الصورة الأساسية: تختفي تدريجياً عند الهوفر إذا كانت هناك صورة ثانية
          "z-10 opacity-100 group-hover/thumbnail:opacity-0": !isSecondary && hasSecondary,
          // تنسيق الصورة الثانية: تكون شفافة وتظهر وتكبر قليلاً عند الهوفر
          "z-20 opacity-0 group-hover/thumbnail:opacity-100 group-hover/thumbnail:scale-105": isSecondary,
        }
      )}
      draggable={false}
      quality={70} // رفعت الجودة قليلاً لأنها تعتمد على الهوفر
      sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 280px"
      fill
      unoptimized={shouldUseUnoptimizedImage(src)}
      onError={() => setImageError(true)}
    />
  )
}

export default Thumbnail