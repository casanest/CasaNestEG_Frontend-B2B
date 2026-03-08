"use client"
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  // الصورة الأساسية (Thumbnail أو أول صورة في المصفوفة)
  const primaryImage = thumbnail || images?.[0]?.url
  // الصورة الثانية (ثاني صورة في المصفوفة إذا وجدت، وإلا نستخدم الأساسية)
  const secondaryImage = images && images.length > 1 ? images[1].url : null

  const aspectRatio = (() => {
    if (isFeatured) return "aspect-[11/14]"
    if (size === "square") return "aspect-[1/1]"
    if (size === "small") return "aspect-[9/12]"
    if (size === "medium") return "aspect-[9/14]"
    if (size === "large") return "aspect-[3/4]"
    return "aspect-[3/4]"
  })()

  const maxHeight = (() => {
    if (size === "medium") return "max-h-[360px]"
    if (size === "large") return "max-h-[420px]"
    return ""
  })()

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-0 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large transition-all ease-in-out duration-300 group/thumbnail",
        aspectRatio,
        maxHeight,
        className
      )}
      data-testid={dataTestid}
    >
      {/* الصورة الأساسية */}
      <ImageOrPlaceholder
        image={primaryImage}
        size={size}
        isSecondary={false}
        hasSecondary={!!secondaryImage}
      />

      {/* الصورة الثانية تظهر فقط عند الهوفر */}
      {secondaryImage && (
        <ImageOrPlaceholder
          image={secondaryImage}
          size={size}
          isSecondary={true}
        />
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

  return (
    <Image
      src={image as string}
      alt="Product Image"
      className={clx(
        "absolute inset-0 object-cover object-center transition-all duration-700 ease-in-out",
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
      onError={() => setImageError(true)}
    />
  )
}

export default Thumbnail