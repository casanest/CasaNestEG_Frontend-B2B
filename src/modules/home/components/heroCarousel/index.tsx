'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

type Slide = {
    image: string;
    alt: string;
    link: string;
    title: string;
    subtitle: string;
    cta: string;
};

const HeroCarousel = ({ locale }: { locale: string }) => {
    const isRTL = locale === 'ar';

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        direction: isRTL ? 'rtl' : 'ltr',
        align: 'start',
    });

    const slides: Slide[] = [
        {
            image: '/home1.jpg',
            alt: 'Office Furniture',
            link: 'categories/office-furniture',
            title: isRTL ? 'أثاث مكتبي' : 'Office Furniture',
            subtitle: isRTL
                ? 'اجعل مكتبك ملاذاً للإنتاجية'
                : 'Make your workspace a productivity haven',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now',
        },
        {
            image: '/home2.jpg',
            alt: 'Hotel Furniture',
            link: 'categories/hotel-furniture',
            title: isRTL ? 'أثاث فنادق' : 'Hotel Furniture',
            subtitle: isRTL
                ? 'اجعل غرفتك ملاذاً للراحة'
                : 'Make your room a haven of comfort',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now',
        },
        {
            image: '/home3.jpg',
            alt: 'Technology',
            link: 'categories/it-devices',
            title: isRTL ? 'أجهزة تقنية' : 'IT Devices',
            subtitle: isRTL
                ? 'كل ما تحتاجه للتكنولوجيا'
                : 'Everything you need for technology',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now',
        },
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const scrollPrev = useCallback(() => {
        emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        emblaApi?.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            emblaApi?.scrollTo(index);
        },
        [emblaApi]
    );

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on('select', onSelect);
        onSelect();

        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }

        autoPlayRef.current = setInterval(() => {
            if (!isHovering) {
                emblaApi.scrollNext();
            }
        }, 5000);

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [emblaApi, isHovering]);

    return (
        <section
            dir={isRTL ? 'rtl' : 'ltr'}
            className="relative w-full my-3 md:my-4 lg:my-8"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Slider */}
            <div
                ref={emblaRef}
                className="overflow-hidden rounded-2xl"
            >
                <div className="flex">
                    {slides.map((slide, idx) => (
                        <div
                            key={idx}
                            className="relative min-w-full"
                        >
                            <Link
                                href={`/${locale}/${slide.link}`}
                                className="block relative aspect-[1720/520]"
                            >
                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    fill
                                    priority={idx === 0}
                                    className="object-cover"
                                    sizes="100vw"
                                />

                                {/* Overlay */}
                                {/* <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" /> */}

                                {/* Content */}
                                {/* <div className="absolute inset-0 flex items-center">
                                    <div className="max-w-2xl px-6 md:px-12 lg:px-20 text-white">
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-3xl md:text-5xl font-bold mb-4"
                                        >
                                            {slide.title}
                                        </motion.h2>

                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6 }}
                                            className="text-sm md:text-lg mb-6 text-white/90"
                                        >
                                            {slide.subtitle}
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.7 }}
                                        >
                                            <button className="h-12 px-7 rounded-xl bg-white text-black font-medium hover:bg-[#022a55] hover:text-white transition-all duration-300">
                                                {slide.cta}
                                            </button>
                                        </motion.div>
                                    </div>
                                </div> */}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrows */}
            <div className="hidden md:flex absolute inset-y-0 items-center justify-between w-full px-5 z-20">
                <button
                    onClick={isRTL ? scrollNext : scrollPrev}
                    className="w-11 h-11 rounded-full bg-white/90 hover:bg-[#022a55] hover:text-white transition flex items-center justify-center shadow-lg"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={isRTL ? scrollPrev : scrollNext}
                    className="w-11 h-11 rounded-full bg-white/90 hover:bg-[#022a55] hover:text-white transition flex items-center justify-center shadow-lg"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-[-25] left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`transition-all duration-300 rounded-full ${selectedIndex === index
                                ? 'w-8 h-3 bg-[#022a55]'
                                : 'w-3 h-3 bg-[#022a55]/50'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;