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
            className="relative w-full h-[25vh] md:h-[60vh]  max-h-[500px] overflow-hidden md:rounded-lg shadow-lg mt-2"
            dir={isRTL ? 'rtl' : 'ltr'}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container flex h-full">
                    {slides.map((slide, idx) => (
                        <div key={`slide-${idx}`} className="embla__slide min-w-full relative flex">
                            <Link href={slide.link} className="w-full h-full block">
                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    fill
                                    className="object-cover"
                                    priority={idx === 0}
                                />
                                <div className={`absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-white bg-black/30 md:px-24 `}
                                dir={isRTL ? 'rtl' : 'ltr'}>
                                    <motion.h2
                                        className="text-lg md:text-5xl font-bold mb-2"
                                        initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {slide.title}
                                    </motion.h2>
                                    <motion.p
                                        className="text-sm md:text-xl mb-6 max-w-md"
                                        initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        {slide.subtitle}
                                    </motion.p>
                                    <motion.button
                                        className=" text-sm md:text-lg py-3 bg-primary text-white rounded-lg  hover:bg-primary-dark transition-colors"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        {slide.cta}
                                    </motion.button>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <motion.div
                className="hidden sm:flex sm:absolute top-1/2 w-full flex justify-between px-4 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}
            >
                <motion.button
                    onClick={isRTL ? scrollNext : scrollPrev}
                    className="bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={isRTL ? "التالي" : "Previous slide"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronLeft size={24} className="w-5 h-5 sm:w-7 sm:h-7" />
                </motion.button>
                <motion.button
                    onClick={isRTL ? scrollPrev : scrollNext}
                    className="bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={isRTL ? "السابق" : "Next slide"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronRight size={24} className="w-5 h-5 sm:w-7 sm:h-7" />
                </motion.button>
            </motion.div>

            {/* Indicators */}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10`}>
                {slides.map((_, index) => (
                    <motion.button
                        key={`indicator-${index}`}
                        className="rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
                        style={{
                            width: index === selectedIndex ? '32px' : '16px',
                            height: '16px',
                            backgroundColor: index === selectedIndex ? "#043364" : "rgba(255, 255, 255, 0.5)"
                        }}
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        whileHover={{ backgroundColor: index === selectedIndex ? "#06529c" : "rgba(255, 255, 255, 0.8)" }}
                        transition={{ duration: 0.2 }}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;