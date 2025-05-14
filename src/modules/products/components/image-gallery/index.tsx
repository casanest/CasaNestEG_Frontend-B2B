"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ImageGalleryProps = {
    images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const [selectedIndex, setSelectedIndex] = useState(0)

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        emblaApi.on("select", onSelect)
        onSelect()
    }, [emblaApi, onSelect])

    return (
        <div className="relative w-full max-w-[480px] mx-auto sm:max-w-[400px] xs:max-w-[320px]">
            <div className="overflow-hidden rounded-xl" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className="relative min-w-full aspect-[4/5] bg-ui-bg-subtle"
                        >
                            <Image
                                src={image.url}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover object-center rounded-xl"
                                priority={index <= 2}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* أزرار التبديل */}
            <button
                onClick={scrollPrev}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 shadow"
            >
                <ChevronLeft size={18} />
            </button>
            <button
                onClick={scrollNext}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 shadow"
            >
                <ChevronRight size={18} />
            </button>

            {/* نقاط المؤشر */}
            <div className="flex justify-center mt-3 gap-1.5">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => emblaApi?.scrollTo(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition ${idx === selectedIndex ? "bg-gray-800" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

export default ImageGallery
