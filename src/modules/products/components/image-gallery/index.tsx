"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import { clx } from "@medusajs/ui"
import {
  normalizeProductImageUrl,
  shouldUseUnoptimizedImage,
} from "@lib/util/product-image-url"

type GalleryImage = Pick<HttpTypes.StoreProductImage, "id" | "url">

type ImageGalleryProps = {
    images?: GalleryImage[] | null
    fallbackImage?: string | null
}

const ImageGallery = ({ images, fallbackImage }: ImageGalleryProps) => {
    const normalized: GalleryImage[] = (images ?? [])
        .filter((img): img is GalleryImage => Boolean(img?.url))
        .map((img, i) => ({
            id: img.id ?? `img-${i}`,
            url: normalizeProductImageUrl(img.url),
        }))

    const display: GalleryImage[] =
        normalized.length > 0
            ? normalized
            : fallbackImage
                ? [{ id: "fallback", url: normalizeProductImageUrl(fallbackImage) }]
                : []

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const mainRef = useRef<HTMLDivElement>(null)

    const [thumbRef, thumbApi] = useEmblaCarousel({
        containScroll: "trimSnaps",
        dragFree: true,
    })

    const scrollTo = useCallback(
        (index: number) => {
            thumbApi?.scrollTo(index)
            setSelectedIndex(index)
        },
        [thumbApi]
    )

    const prev = useCallback(() => {
        const next = (selectedIndex - 1 + display.length) % display.length
        scrollTo(next)
    }, [selectedIndex, display.length, scrollTo])

    const next = useCallback(() => {
        const next = (selectedIndex + 1) % display.length
        scrollTo(next)
    }, [selectedIndex, display.length, scrollTo])

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev()
            if (e.key === "ArrowRight") next()
            if (e.key === "Escape") setLightboxOpen(false)
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [prev, next])

    // Touch swipe
    const touchStart = useRef(0)
    const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX }
    const handleTouchEnd = (e: React.TouchEvent) => {
        const delta = touchStart.current - e.changedTouches[0].clientX
        if (delta > 50) next()
        if (delta < -50) prev()
    }

    const selected = display[selectedIndex]

    if (display.length === 0) {
        return (
            <div className="flex items-center justify-center w-full aspect-[4/5] rounded-2xl bg-gray-50 border border-gray-100">
                <PlaceholderImage size={32} />
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-3 lg:gap-[clamp(12px,1vw,16px)] w-full select-none">
                {/* Main Image Container */}
                <div
                    ref={mainRef}
                    className="group relative w-full rounded-[16px] overflow-hidden border border-[#e5e7eb] bg-gray-50 cursor-zoom-in transition-transform duration-500 ease-out"
                    style={{ aspectRatio: "4 / 3" }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => setLightboxOpen(true)}
                >
                    {selected?.url ? (
                        <div className="absolute inset-0">
                            <div className="relative w-full h-full">
                                <Image
                                    key={selected.url}
                                    src={selected.url}
                                    alt={`Product image ${selectedIndex + 1}`}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    unoptimized={shouldUseUnoptimizedImage(selected.url)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                            <ImageIcon className="w-12 h-12 text-gray-300" />
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {display.length > 1 && (
                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                                onClick={(e) => { e.stopPropagation(); prev() }}
                                className="bg-white/95 backdrop-blur-sm shadow-xl p-3 rounded-full hover:bg-[#17284a] hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next() }}
                                className="bg-white/95 backdrop-blur-sm shadow-xl p-3 rounded-full hover:bg-[#17284a] hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Thumbnail Strip */}
                {display.length > 1 && (
                    <div className="relative w-full overflow-hidden">
                        <div className="overflow-hidden w-full" ref={thumbRef}>
                            <div className="flex gap-2.5 lg:gap-[clamp(8px,0.8vw,12px)] overflow-x-auto scrollbar-hide py-1 justify-center">
                                {display.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => scrollTo(i)}
                                        className={clx(
                                            "relative flex-shrink-0 w-[88px] h-[88px] sm:w-[clamp(80px,7vw,96px)] sm:h-[clamp(80px,7vw,96px)] rounded-[10px] overflow-hidden bg-gray-50 transition-all duration-300",
                                            i === selectedIndex
                                                ? "border-2 border-[#17284a]"
                                                : "border border-[#e5e7eb] opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img.url}
                                                alt={`Thumbnail ${i + 1}`}
                                                fill
                                                sizes="96px"
                                                className="object-cover object-center"
                                                unoptimized={shouldUseUnoptimizedImage(img.url)}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox — white popup matching Figma design (portaled to body to escape sticky stacking context) */}
            {lightboxOpen && selected?.url && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div
                        className="bg-white rounded-[16px] p-4 flex flex-col gap-4 max-w-[1200px] w-full max-h-[90vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute -top-3 -right-3 z-20 bg-[#17284a] text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#0f1d35] transition-colors shadow-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Main image area with nav arrows */}
                        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
                            {/* Left arrow */}
                            {display.length > 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); prev() }}
                                    className="absolute left-2 z-10 bg-[#17284a] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#0f1d35] transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            )}

                            {/* Image */}
                            <div className="relative w-full h-full max-h-[70vh] aspect-[16/10] rounded-[8px] overflow-hidden bg-gray-50">
                                <Image
                                    src={selected.url}
                                    alt={`Product image ${selectedIndex + 1}`}
                                    fill
                                    priority
                                    sizes="90vw"
                                    unoptimized={shouldUseUnoptimizedImage(selected.url)}
                                    className="object-contain object-center"
                                />
                            </div>

                            {/* Right arrow */}
                            {display.length > 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); next() }}
                                    className="absolute right-2 z-10 bg-[#17284a] text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#0f1d35] transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        {display.length > 1 && (
                            <div className="flex gap-2 items-center justify-center overflow-x-auto scrollbar-hide">
                                {display.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={(e) => { e.stopPropagation(); scrollTo(i) }}
                                        className={clx(
                                            "relative flex-shrink-0 w-[137px] h-[89px] rounded-[8px] overflow-hidden bg-gray-50 transition-all",
                                            i === selectedIndex
                                                ? "opacity-100 ring-2 ring-[#17284a]"
                                                : "opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img.url}
                                                alt={`Thumbnail ${i + 1}`}
                                                fill
                                                sizes="137px"
                                                className="object-cover object-center"
                                                unoptimized={shouldUseUnoptimizedImage(img.url)}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export default ImageGallery