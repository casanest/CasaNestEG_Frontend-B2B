"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import clsx from "clsx"
import { ChevronLeft, ChevronRight, ZoomIn, X, ImageIcon } from "lucide-react"
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
    const [zoomed, setZoomed] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
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
            if (e.key === "Escape") { setLightboxOpen(false); setZoomed(false) }
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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoomed || !mainRef.current) return
        const rect = mainRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePos({ x, y })
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
            <div className="flex flex-col gap-5 w-full select-none max-w-xl mx-auto">
                {/* Main Image Container */}
                <div
                    ref={mainRef}
                    className="group relative w-full mx-auto aspect-square rounded-xl overflow-hidden border border-[#043364]/10 bg-gray-50 shadow-[0_24px_60px_-35px_rgba(2,8,23,0.5)] cursor-zoom-in transition-transform duration-500 ease-out"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onMouseMove={handleMouseMove}
                    onClick={() => { setLightboxOpen(true); setZoomed(false) }}
                >
                    {selected?.url ? (
                        <div className="absolute inset-0 ">
                            <div className="relative w-full h-full">
                                <Image
                                    key={selected.url}
                                    src={selected.url}
                                    alt={`Product image ${selectedIndex + 1}`}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                                    unoptimized={shouldUseUnoptimizedImage(selected.url)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                            <ImageIcon className="w-12 h-12 text-gray-300" />
                        </div>
                    )}

                    {/* Elegant Overlay Controls */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" /> */}

                    {/* Counter Badge - Modern Glassmorphism */}
                    {display.length > 1 && (
                        <div className="absolute top-5 left-5 bg-white/80 backdrop-blur-md text-gray-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/60 shadow-sm">
                            {selectedIndex + 1} <span className="text-gray-400 mx-1">/</span> {display.length}
                        </div>
                    )}

                    {/* Zoom Hint - Sophisticated Icon */}
                    <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <ZoomIn className="w-4 h-4 text-[#043364]" />
                    </div>

                    {/* Main Navigation Arrows - Premium Feel */}
                    {display.length > 1 && (
                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                                onClick={(e) => { e.stopPropagation(); prev() }}
                                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl p-3 rounded-full hover:bg-[#043364] hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next() }}
                                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl p-3 rounded-full hover:bg-[#043364] hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Sophisticated Dot Indicators (iOS Style) */}
                    {display.length > 1 && display.length <= 8 && (
                        <div className="absolute bottom-3 mx-auto left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-full bg-white/70 backdrop-blur-md shadow-sm">
                            {display.map((_, i) => (
                                <div
                                    key={i}
                                    className={clx(
                                        "h-1.5 rounded-full transition-all duration-500",
                                        i === selectedIndex
                                            ? "w-6 bg-[#043364]"
                                            : "w-1.5 bg-[#043364]/40"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Thumbnail Strip - Enhanced Carousel */}
                {display.length > 1 && (
                    <div className="relative group/thumbs w-full overflow-hidden mx-auto">
                        <div className="overflow-hidden w-full" ref={thumbRef}>
                            <div className="flex justify-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide py-2">
                                {display.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => scrollTo(i)}
                                        className={clx(
                                            "relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-transparent bg-gray-50 p-1 transition-all duration-300 ease-out",
                                            i === selectedIndex
                                                ? "ring-2 ring-[#043364] ring-offset-2 ring-offset-white shadow-lg"
                                                : "opacity-70 hover:opacity-100"
                                        )}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img.url}
                                                alt={`Thumbnail ${i + 1}`}
                                                fill
                                                sizes="96px"
                                                className="object-contain object-center"
                                                unoptimized={shouldUseUnoptimizedImage(img.url)}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* arrows hide on mobile */}
                        <button
                            onClick={prev}
                            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full opacity-0 group-hover/thumbs:opacity-100 transition-opacity hover:bg-gray-50 border border-gray-100"
                        >
                            <ChevronLeft className="w-3 h-3 text-gray-600" />
                        </button>

                        <button
                            onClick={next}
                            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full opacity-0 group-hover/thumbs:opacity-100 transition-opacity hover:bg-gray-50 border border-gray-100"
                        >
                            <ChevronRight className="w-3 h-3 text-gray-600" />
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && selected?.url && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => { if (!zoomed) setLightboxOpen(false) }}
                >
                    {/* Close */}
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                        {selectedIndex + 1} / {display.length}
                    </div>

                    {/* Zoomed image */}
                    <div
                        className={clsx(
                            "relative w-full max-w-4xl mx-6 sm:mx-8 aspect-square overflow-hidden rounded-xl bg-gray-50 p-4 sm:p-6 transition-all",
                            zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                        )}
                        onClick={(e) => { e.stopPropagation(); setZoomed(!zoomed) }}
                        onMouseMove={handleMouseMove}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={selected.url}
                                alt={`Product image ${selectedIndex + 1}`}
                                fill
                                priority
                                sizes="90vw"
                                unoptimized={shouldUseUnoptimizedImage(selected.url)}
                                className={clsx(
                                    "object-contain object-center transition-transform duration-200",
                                    zoomed ? "scale-[2.5] origin-[var(--ox)_var(--oy)]" : "scale-100"
                                )}
                                style={zoomed ? {
                                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                                } : {}}
                            />
                        </div>
                    </div>

                    {/* Nav arrows in lightbox */}
                    {display.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev() }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition hover:scale-110 z-10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next() }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition hover:scale-110 z-10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Thumbnail strip in lightbox */}
                    {display.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-[#043364]/10 backdrop-blur-md rounded-2xl">
                            {display.map((img, i) => (
                                <button
                                    key={img.id}
                                    onClick={(e) => { e.stopPropagation(); scrollTo(i) }}
                                    className={clsx(
                                        "relative w-10 h-10 rounded-lg overflow-hidden border-2 bg-gray-50 p-1 transition-all",
                                        i === selectedIndex ? "border-[#043364] scale-110" : "border-[#043364]/30 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    {img.url && (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img.url}
                                                alt=""
                                                fill
                                                sizes="40px"
                                                className="object-contain object-center"
                                                unoptimized={shouldUseUnoptimizedImage(img.url)}
                                            />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default ImageGallery