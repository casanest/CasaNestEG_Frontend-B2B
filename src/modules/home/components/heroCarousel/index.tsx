'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Slide = {
    image: string;
    alt: string;
    link: string;
    title: string;
    subtitle: string;
    cta: string;
};


const HeroCarousel = ({ locale }: { locale: string }) => {
    const isRTL = locale === "ar";
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        skipSnaps: false,
        duration: 30,
        direction: isRTL ? 'rtl' : 'ltr'
    });

    const slides: Slide[] = [
        {
            image: '/home1.jpg',
            alt: 'Refrigerator filled with fresh fruits and juices',
            link: '/categories/refrigerators',
            title: isRTL ? 'ثلاجات مميزة' : 'Premium Refrigerators',
            subtitle: isRTL ? 'استمتع بأفضل تجربة تبريد' : 'Experience the best cooling',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now'
        },
        {
            image: '/home2.jpg',
            alt: 'Modern kitchen with built-in appliances',
            link: '/categories/kitchen',
            title: isRTL ? 'مطبخ عصري' : 'Modern Kitchen',
            subtitle: isRTL ? 'كل ما تحتاجه لمطبخك' : 'Everything you need for your kitchen',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now'
        },
        {
            image: '/home3.jpg',
            alt: 'Elegant kitchen with modern appliances',
            link: '/categories/kitchen',
            title: isRTL ? 'أجهزة مطبخ أنيقة' : 'Elegant Kitchen Appliances',
            subtitle: isRTL ? 'أضف لمسة من الأناقة' : 'Add a touch of elegance',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now'
        },
    ];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef(0);

    const scrollTo = useCallback((index: number) => {
        if (!emblaApi) return;
        emblaApi.scrollTo(index);
    }, [emblaApi]);

    const scrollPrev = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect);
        onSelect();
        return () => emblaApi.off('select', onSelect);
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const interval = setInterval(() => {
            if (!isHovering && !isDragging) emblaApi.scrollNext();
        }, 5000);
        return () => clearInterval(interval);
    }, [emblaApi, isHovering, isDragging]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        setIsDragging(true);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchStartX.current - touchEndX;

        if (deltaX > 50) scrollNext();
        if (deltaX < -50) scrollPrev();

        setIsDragging(false);
    };

    return (
        <section
            className="relative w-full h-[30vh] sm:h-[40vh] lg:h-[50vh]  overflow-hidden md:rounded-lg shadow-xl md:my-2"
            dir={isRTL ? 'rtl' : 'ltr'}
            // onMouseEnter={() => setIsHovering(true)}
            // onMouseLeave={() => setIsHovering(false)}
            onMouseEnter={() => {
                setIsHovering(true);
                stopAutoPlay();
            }}
            onMouseLeave={() => {
                setIsHovering(false);
                startAutoPlay();
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container flex h-full">
                    <AnimatePresence initial={false} custom={isRTL}>
                        {slides.map((slide, idx) => (
                            <div key={`slide-${idx}`} className="embla__slide min-w-full relative flex">
                                <Link href={slide.link} className="w-full h-full block">
                                    <Image
                                        src={slide.image}
                                        alt={slide.alt}
                                        fill
                                        className="object-cover"
                                        priority={idx === 0}
                                        quality={90}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                                    />
                                    <div className={`absolute inset-0 flex flex-col justify-center items-start p-6 sm:p-12 lg:p-16 xl:p-24 text-white bg-gradient-to-r ${isRTL ? 'from-black/70 via-black/40 to-transparent' : 'from-black/70 via-black/40 to-transparent'}`}>
                                        <motion.div
                                            className="max-w-xl"
                                            initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: isRTL ? -100 : 100 }}
                                            transition={{ duration: 0.7 }}
                                        >
                                            <motion.h2
                                                className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                            >
                                                {slide.title}
                                            </motion.h2>
                                            <motion.p
                                                className="text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-md lg:max-w-lg"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.4 }}
                                            >
                                                {slide.subtitle}
                                            </motion.p>
                                            <motion.button
                                                className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base lg:text-lg font-medium bg-[#043364] hover:bg-[#06529c] text-white rounded-lg transition-colors duration-300 shadow-lg"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.6 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {slide.cta}
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Arrows */}
            <motion.div
                className="hidden sm:flex sm:absolute top-1/2 -translate-y-1/2 w-full justify-between px-4 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0.5 }}
                transition={{ duration: 0.3 }}
                whileHover={{ opacity: 1 }}
            >
                <motion.button
                    onClick={isRTL ? scrollNext : scrollPrev}
                    className="bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={isRTL ? "التالي" : "Previous slide"}
                    whileHover={{ scale: 1.1, backgroundColor: "#043364", color: "white" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
                <motion.button
                    onClick={isRTL ? scrollPrev : scrollNext}
                    className="bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={isRTL ? "السابق" : "Next slide"}
                    whileHover={{ scale: 1.1, backgroundColor: "#043364", color: "white" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
            </motion.div>

            {/* Indicators */}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10`}>
                {slides.map((_, index) => (
                    <motion.button
                        key={`indicator-${index}`}
                        className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${index === selectedIndex ? 'opacity-100' : 'opacity-70'}`}
                        style={{
                            width: index === selectedIndex ? '24px' : '12px',
                            height: '12px',
                            backgroundColor: index === selectedIndex ? "#043364" : "rgba(255, 255, 255, 0.7)"
                        }}
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        whileHover={{
                            scale: 1.2,
                            backgroundColor: index === selectedIndex ? "#06529c" : "rgba(255, 255, 255, 0.9)"
                        }}
                        transition={{ duration: 0.2 }}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;