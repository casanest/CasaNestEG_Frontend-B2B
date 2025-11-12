"use client"

import { useState, useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import ReactImageMagnify from "react-image-magnify"
import Image from "next/image"
import clsx from "clsx"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

type GalleryImage = Pick<HttpTypes.StoreProductImage, "id" | "url">

type ImageGalleryProps = {
    images?: GalleryImage[] | null
    fallbackImage?: string | null
}

const ImageGallery = ({ images, fallbackImage }: ImageGalleryProps) => {
    const normalizedImages: GalleryImage[] = (images ?? [])
        .filter((img): img is GalleryImage => Boolean(img?.url))
        .map((img, index) => ({
            id: img.id ?? `image-${index}`,
            url: img.url,
        }))

    const displayImages: GalleryImage[] =
        normalizedImages.length > 0
            ? normalizedImages
            : fallbackImage
            ? [{ id: "fallback-thumbnail", url: fallbackImage }]
            : []

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaRef, emblaApi] = useEmblaCarousel({ containScroll: "trimSnaps", dragFree: true })

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) {
                emblaApi.scrollTo(index)
                setSelectedIndex(index)
            }
        },
        [emblaApi]
    )

    const scrollPrev = () => emblaApi?.scrollPrev()
    const scrollNext = () => emblaApi?.scrollNext()

    useEffect(() => {
        if (selectedIndex >= displayImages.length && displayImages.length > 0) {
            setSelectedIndex(0)
        }
    }, [displayImages.length, selectedIndex])

    const selectedImage = displayImages[selectedIndex]

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
        emblaApi.on("select", onSelect)
        onSelect()
    }, [emblaApi])

    if (displayImages.length === 0) {
        return (
            <div className="flex items-center justify-center w-full max-w-5xl mx-auto px-4 aspect-[4/5] border rounded-lg bg-ui-bg-subtle">
                <PlaceholderImage size={32} />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto px-4 relative">
            {/* Zoomed Image */}
            <div className="w-full max-w-lg aspect-[4/5] relative border rounded-lg overflow-hidden shadow-md mb-4">
                {selectedImage?.url && (
                    <ReactImageMagnify
                        {...{
                            smallImage: {
                                alt: `Product image ${selectedIndex + 1}`,
                                isFluidWidth: true,
                                src: selectedImage.url,
                            },
                            largeImage: {
                                src: selectedImage.url,
                                width: 1600,
                                height: 1600,
                            },
                            enlargedImageContainerDimensions: {
                                width: "200%",
                                height: "200%",
                            },
                            enlargedImagePosition: "over",
                        }}
                    />
                )}
            </div>

            {/* Thumbnails with navigation */}
            <div className="relative w-50 px-4">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-3 py-2 px-12">
                        {displayImages.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => scrollTo(index)}
                                aria-label={`Select image ${index + 1}`}
                                className={clsx(
                                    "relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                                    selectedIndex === index
                                        ? "border-blue-500 ring-2 ring-blue-300"
                                        : "border-gray-200 hover:border-blue-400"
                                )}
                            >
                                {img.url && (
                                    <Image
                                        src={img.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        loading="lazy"
                                        className="object-cover"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div>
                    <button
                        onClick={scrollPrev}
                        aria-label="Scroll to previous image"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100 transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={scrollNext}
                        aria-label="Scroll to next image"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100 transition"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageGallery


// "use client"
// import { useState, useCallback, useEffect, useRef } from "react"
// import useEmblaCarousel from "embla-carousel-react"
// import { HttpTypes } from "@medusajs/types"
// import ReactImageMagnify from "react-image-magnify"
// import Image from "next/image"
// import clsx from "clsx"
// import { ChevronLeft, ChevronRight, Maximize, Minimize, MoveLeft, MoveRight } from "lucide-react"

// type ImageGalleryProps = {
//     images: HttpTypes.StoreProductImage[]
//     productName?: string
// }

// const ImageGallery = ({ images, productName = "Product" }: ImageGalleryProps) => {
//     const [selectedIndex, setSelectedIndex] = useState(0)
//     const [isZoomed, setIsZoomed] = useState(false)
//     const [isFullscreen, setIsFullscreen] = useState(false)
//     const [isHoveringMain, setIsHoveringMain] = useState(false)
//     const [isHoveringThumbs, setIsHoveringThumbs] = useState(false)
//     const mainImageRef = useRef<HTMLDivElement>(null)
//     const touchStartX = useRef(0)
//     const [emblaRef, emblaApi] = useEmblaCarousel({
//         containScroll: "trimSnaps",
//         dragFree: true,
//         loop: true,
//         align: "center"
//     })

//     const scrollTo = useCallback((index: number) => {
//         if (emblaApi) {
//             emblaApi.scrollTo(index)
//             setSelectedIndex(index)
//             setIsZoomed(false)
//         }
//     }, [emblaApi])

//     const scrollPrev = useCallback(() => {
//         emblaApi?.scrollPrev()
//         setIsZoomed(false)
//     }, [emblaApi])

//     const scrollNext = useCallback(() => {
//         emblaApi?.scrollNext()
//         setIsZoomed(false)
//     }, [emblaApi])

//     const toggleFullscreen = useCallback(() => {
//         if (!document.fullscreenElement) {
//             mainImageRef.current?.requestFullscreen()
//                 .then(() => setIsFullscreen(true))
//                 .catch(console.error)
//         } else {
//             document.exitFullscreen()
//                 .then(() => setIsFullscreen(false))
//                 .catch(console.error)
//         }
//     }, [])

//     useEffect(() => {
//         if (!emblaApi) return

//         const onSelect = () => {
//             setSelectedIndex(emblaApi.selectedScrollSnap())
//             setIsZoomed(false)
//         }

//         emblaApi.on("select", onSelect)
//         onSelect()

//         const handleKeyDown = (e: KeyboardEvent) => {
//             switch (e.key) {
//                 case 'ArrowLeft': scrollPrev(); break
//                 case 'ArrowRight': scrollNext(); break
//                 case 'Escape': setIsZoomed(false); setIsFullscreen(false); break
//                 case 'f': case 'F': toggleFullscreen(); break
//             }
//         }

//         window.addEventListener('keydown', handleKeyDown)
//         return () => {
//             emblaApi.off("select", onSelect)
//             window.removeEventListener('keydown', handleKeyDown)
//         }
//     }, [emblaApi, scrollPrev, scrollNext, toggleFullscreen])

//     const handleTouchStart = (e: React.TouchEvent) => {
//         touchStartX.current = e.touches[0].clientX
//     }

//     const handleTouchEnd = (e: React.TouchEvent) => {
//         const delta = touchStartX.current - e.changedTouches[0].clientX
//         if (delta > 50) scrollNext()
//         if (delta < -50) scrollPrev()
//     }

//     const selectedImage = images[selectedIndex]

//     if (!images || images.length === 0) {
//         return (
//             <div className="flex items-center justify-center w-full max-w-5xl mx-auto aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
//                 <span className="text-gray-400 font-medium">No images available</span>
//             </div>
//         )
//     }

//     return (
//         <div className={`flex flex-col items-center gap-6 w-full mx-auto relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : 'max-w-5xl px-4'}`}>
//             <div
//                 ref={mainImageRef}
//                 className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full aspect-[4/5] max-w-2xl'} rounded-2xl overflow-hidden shadow-xl transition-all duration-300 bg-gray-50`}
//                 onMouseEnter={() => setIsHoveringMain(true)}
//                 onMouseLeave={() => setIsHoveringMain(false)}
//                 onTouchStart={handleTouchStart}
//                 onTouchEnd={handleTouchEnd}
//             >
//                 {selectedImage?.url && (
//                     <ReactImageMagnify
//                         {...{
//                             smallImage: {
//                                 alt: `${productName} - Image ${selectedIndex + 1}`,
//                                 isFluidWidth: true,
//                                 src: selectedImage.url,
//                                 className: "object-contain",
//                             },
//                             largeImage: {
//                                 src: selectedImage.url,
//                                 width: 2000,
//                                 height: 2000,
//                             },
//                             enlargedImageContainerDimensions: {
//                                 width: isFullscreen ? "150%" : "200%",
//                                 height: isFullscreen ? "150%" : "200%",
//                             },
//                             enlargedImagePosition: isZoomed ? "over" : "beside",
//                             isHintEnabled: true,
//                             shouldUsePositiveSpaceLens: isZoomed,
//                             isActivatedOnTouch: true,
//                             style: {
//                                 cursor: isZoomed ? "zoom-out" : "zoom-in",
//                                 transition: "transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)",
//                             },
//                             enlargedImageContainerStyle: {
//                                 backgroundColor: "white",
//                                 zIndex: 10,
//                                 boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
//                             },
//                             lensStyle: {
//                                 backgroundColor: "rgba(255,255,255,0.4)",
//                                 border: "1px solid rgba(0,0,0,0.1)",
//                                 backdropFilter: "blur(2px)",
//                             }
//                         }}
//                     />
//                 )}

//                 <div className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${isHoveringMain ? 'opacity-100' : 'opacity-0'}`}>
//                     <button
//                         onClick={() => setIsZoomed(!isZoomed)}
//                         aria-label={isZoomed ? "Zoom out" : "Zoom in"}
//                         className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all hover:scale-110 active:scale-95"
//                     >
//                         {isZoomed ? <Minimize size={18} /> : <Maximize size={18} />}
//                     </button>
//                     <button
//                         onClick={toggleFullscreen}
//                         aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//                         className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all hover:scale-110 active:scale-95"
//                     >
//                         {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
//                     </button>
//                 </div>

//                 <div className={`absolute inset-0 flex items-center justify-between px-4 pointer-events-none ${isFullscreen ? 'opacity-100' : 'md:opacity-0'} ${isHoveringMain && !isFullscreen ? 'md:opacity-100' : ''} transition-opacity duration-300`}>
//                     <button
//                         onClick={scrollPrev}
//                         aria-label="Previous image"
//                         className="pointer-events-auto p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95"
//                     >
//                         <ChevronLeft size={24} className="text-gray-700" />
//                     </button>
//                     <button
//                         onClick={scrollNext}
//                         aria-label="Next image"
//                         className="pointer-events-auto p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95"
//                     >
//                         <ChevronRight size={24} className="text-gray-700" />
//                     </button>
//                 </div>

//                 <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-sm px-3 py-1 rounded-full shadow-md flex items-center gap-1 transition-opacity duration-300 ${isHoveringMain || isFullscreen ? 'opacity-100' : 'opacity-0'}`} aria-live="polite">
//                     <span className="font-medium text-gray-800">{selectedIndex + 1}</span>
//                     <span className="text-gray-500">/</span>
//                     <span className="text-gray-500">{images.length}</span>
//                 </div>
//             </div>

//             {!isFullscreen && (
//                 <div className="relative w-full max-w-2xl px-10" onMouseEnter={() => setIsHoveringThumbs(true)} onMouseLeave={() => setIsHoveringThumbs(false)}>
//                     <div className="overflow-hidden" ref={emblaRef}>
//                         <div className="flex gap-3 py-2">
//                             {images.map((img, index) => (
//                                 <button
//                                     key={img.id}
//                                     onClick={() => scrollTo(index)}
//                                     aria-label={`View ${productName} image ${index + 1}`}
//                                     className={clsx(
//                                         "relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 group",
//                                         selectedIndex === index
//                                             ? "border-blue-600 ring-2 ring-blue-400 scale-105 shadow-md"
//                                             : "border-gray-200 hover:border-blue-400 hover:scale-105"
//                                     )}
//                                 >
//                                     {img.url && (
//                                         <>
//                                             <Image
//                                                 src={img.url}
//                                                 alt={`${productName} thumbnail ${index + 1}`}
//                                                 fill
//                                                 sizes="80px"
//                                                 loading="lazy"
//                                                 className="object-cover transition-transform duration-300 group-hover:scale-110"
//                                             />
//                                             <div className={clsx(
//                                                 "absolute inset-0 transition-opacity duration-300",
//                                                 selectedIndex === index ? "bg-black/10" : "bg-black/5 group-hover:bg-black/10"
//                                             )} />
//                                         </>
//                                     )}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {images.length > 4 && (
//                         <>
//                             <button
//                                 onClick={scrollPrev}
//                                 aria-label="Scroll thumbnails left"
//                                 className={clsx(
//                                     "absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-md p-2 rounded-full z-10 hover:bg-white transition-all hover:scale-110 active:scale-95",
//                                     isHoveringThumbs ? 'opacity-100' : 'opacity-0'
//                                 )}
//                             >
//                                 <MoveLeft size={20} className="text-gray-700" />
//                             </button>
//                             <button
//                                 onClick={scrollNext}
//                                 aria-label="Scroll thumbnails right"
//                                 className={clsx(
//                                     "absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-md p-2 rounded-full z-10 hover:bg-white transition-all hover:scale-110 active:scale-95",
//                                     isHoveringThumbs ? 'opacity-100' : 'opacity-0'
//                                 )}
//                             >
//                                 <MoveRight size={20} className="text-gray-700" />
//                             </button>
//                         </>
//                     )}
//                 </div>
//             )}

//             {isFullscreen && (
//                 <button
//                     onClick={toggleFullscreen}
//                     aria-label="Exit fullscreen"
//                     className="fixed top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95 z-50"
//                 >
//                     <Minimize size={20} className="text-gray-700" />
//                 </button>
//             )}
//         </div>
//     )
// }

// export default ImageGallery
