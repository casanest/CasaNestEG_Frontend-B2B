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

const slides: Slide[] = [
    {
        image: '/hero/fridge-1.jpg',
        alt: 'Refrigerator filled with fresh fruits and juices',
        link: '/categories/refrigerators',
        title: 'Keep Your Summer Cool',
        subtitle: 'Discover our premium refrigerator collection',
        cta: 'Shop Now'
    },
    {
        image: '/hero/fridge-2.jpg',
        alt: 'Modern refrigerator with golden accents',
        link: '/categories/refrigerators?type=premium',
        title: 'Smart Cooling Technology',
        subtitle: 'Energy efficient with smart features',
        cta: 'View Premium'
    },
    {
        image: '/hero/kitchen-1.jpg',
        alt: 'Elegant kitchen with modern appliances',
        link: '/categories/kitchen',
        title: 'Complete Kitchen Solutions',
        subtitle: 'Everything for your modern kitchen',
        cta: 'Explore Collection'
    },
];

const HeroCarousel = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        skipSnaps: false,
        duration: 30
    });

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

        const interval = setInterval(() => {
            if (!isHovering && !isDragging) {
                emblaApi.scrollNext();
            }
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

    // Animation variants
    const slideIn = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        },
        exit: { opacity: 0, x: -50 }
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const buttonHover = {
        scale: 1.05,
        backgroundColor: "#06529c", // Slightly lighter shade of primary
        transition: { duration: 0.2 }
    };

    const buttonTap = {
        scale: 0.95
    };

    return (
        <section
            className="relative w-full h-[50vh] md:h-[80vh] min-h-[400px] max-h-[500px] overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Carousel container */}
            <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container flex h-full">
                    {slides.map((slide, idx) => (
                        <div key={`slide-${idx}`} className="embla__slide min-w-full relative flex">
                            <Link href={slide.link} className="w-full h-full block">
                                <motion.div
                                    className="absolute inset-0"
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 8, ease: "linear" }}
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.alt}
                                        fill
                                        className="object-cover"
                                        priority={idx === 0}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                                    />
                                </motion.div>

                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center items-start px-6 sm:pl-10 md:pl-20 text-white">
                                    <AnimatePresence mode="wait">
                                        {selectedIndex === idx && (
                                            <motion.div
                                                className="max-w-2xl"
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={slideIn}
                                                key={`content-${idx}`}
                                            >
                                                <motion.h2
                                                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                                                    variants={fadeIn}
                                                >
                                                    {slide.title}
                                                </motion.h2>
                                                <motion.p
                                                    className="text-lg sm:text-xl md:text-2xl mb-6"
                                                    variants={fadeIn}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    {slide.subtitle}
                                                </motion.p>
                                                <motion.button
                                                    className="text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                                                    style={{ backgroundColor: "#043364" }}
                                                    variants={fadeIn}
                                                    transition={{ delay: 0.2 }}
                                                    whileHover={buttonHover}
                                                    whileTap={buttonTap}
                                                    aria-label={slide.cta}
                                                >
                                                    {slide.cta}
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <motion.div
                className={`hidden sm:flex sm:absolute top-1/2 w-full flex justify-between px-4 z-10`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}
            >
                <motion.button
                    onClick={scrollPrev}
                    className="bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Previous slide"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronLeft size={24} className="w-5 h-5 sm:w-7 sm:h-7" />
                </motion.button>
                <motion.button
                    onClick={scrollNext}
                    className="bg-white/90 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Next slide"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronRight size={24} className="w-5 h-5 sm:w-7 sm:h-7" />
                </motion.button>
            </motion.div>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <motion.button
                        key={`indicator-${index}`}
                        className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white`}
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