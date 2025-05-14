"use client"

import { useState, useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { HttpTypes } from "@medusajs/types"
import ReactImageMagnify from "react-image-magnify"
import Image from "next/image"
import clsx from "clsx"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ImageGalleryProps = {
    images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
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

    const selectedImage = images[selectedIndex]

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
        emblaApi.on("select", onSelect)
        onSelect()
    }, [emblaApi])

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto px-4 relative max-h-[calc(100vh-5rem)]">
            {/* Zoomed Image */}
            <div className="w-full relative aspect-[4/5] border rounded-lg overflow-hidden max-w-lg shadow-md">
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
                                width: "250%",
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
                    <div className="flex gap-3 py-2 px-10">
                        {images.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => scrollTo(index)}
                                aria-label={`Select image ${index + 1}`}
                                className={clsx(
                                    "relative w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
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
                        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white shadow-md p-1.5 rounded-full z-10 hover:bg-gray-100 transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={scrollNext}
                        aria-label="Scroll to next image"
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white shadow-md p-1.5 rounded-full z-10 hover:bg-gray-100 transition"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageGallery
