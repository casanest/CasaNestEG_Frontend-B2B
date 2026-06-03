'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
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

const HeroCarousel = ({ locale, dir }: { locale: string; dir: string }) => {
    const isRTL = dir === 'rtl';
    console.log('HeroCarousel locale and dir:', { locale, dir, isRTL });
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        direction: isRTL ? 'rtl' : 'ltr',
        align: 'start',
    });

    const slides: Slide[] = [
        {
            image: isRTL ? '/home-1-ar.jpg' : '/home-1-en.jpg',
            alt: 'Office Furniture',
            link: 'categories/office-furniture',
            title: isRTL ? 'أثاث مكتبي' : 'Office Furniture',
            subtitle: isRTL
                ? 'اجعل مكتبك ملاذاً للإنتاجية'
                : 'Make your workspace a productivity haven',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now',
        },
        {
            image: isRTL ? '/home-2-ar.jpg' : '/home-2-en.jpg',
            alt: 'Hotel Furniture',
            link: 'categories/hotel-furniture',
            title: isRTL ? 'أثاث فنادق' : 'Hotel Furniture',
            subtitle: isRTL
                ? 'اجعل غرفتك ملاذاً للراحة'
                : 'Make your room a haven of comfort',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now',
        },
        {
            image: isRTL ? '/home-3-ar.jpg' : '/home-3-en.jpg',
            alt: 'Technology',
            link: 'categories/it-devices',
            title: isRTL ? 'أجهزة تقنية' : 'IT Devices',
            subtitle: isRTL
                ? 'كل ما تحتاجه للتكنولوجيا'
                : 'Everything you need for technology',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now',
        },
        {
            image: isRTL ? '/home-4-ar.jpg' : '/home-4-en.jpg',
            alt: 'Home Furniture',
            link: 'categories/home-furniture',
            title: isRTL ? 'أثاث منزلي' : 'Home Furniture',
            subtitle: isRTL
                ? 'اجعل منزلك ملاذاً للراحة'
                : 'Make your home a haven of comfort',
            cta: isRTL ? 'استكشف الآن' : 'Explore Now',
        },
        // اجهزه كهربائيه
        {
            image: isRTL ? '/home-5-ar.jpg' : '/home-5-en.jpg',
            alt: 'Electrical Appliances',
            link: 'categories/electrical-appliances',
            title: isRTL ? 'أجهزة كهربائية' : 'Electrical Appliances',
            subtitle: isRTL
                ? 'كل ما تحتاجه من الأجهزة الكهربائية'
                : 'Everything you need in electrical appliances',
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
            className="relative w-full my-2 md:my-3 lg:my-5 shadow-lg rounded-2xl "
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
                        // <div
                        //     itemType='Link'
                        //     key={idx}
                        //     className="relative min-w-full"
                        // >
                        <LocalizedClientLink
                            key={idx}
                            href={`/${slide.link}`}
                            className=" min-w-full relative aspect-[1500/700] md:aspect-[1720/520] rounded-2xl overflow-hidden cursor-pointer z-10"
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
                        </LocalizedClientLink>
                        // </div>
                    ))}
                </div>
            </div>

            {/* Arrows */}
            <div className="hidden md:flex absolute inset-y-0 items-center justify-between w-full px-5 z-20 pointer-events-none">
                <button
                    onClick={isRTL ? scrollNext : scrollPrev}
                    className="w-11 h-11 rounded-full bg-white/90 hover:bg-[#022a55] hover:text-white transition flex items-center justify-center shadow-lg pointer-events-auto"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={isRTL ? scrollPrev : scrollNext}
                    className="w-11 h-11 rounded-full bg-white/90 hover:bg-[#022a55] hover:text-white transition flex items-center justify-center shadow-lg pointer-events-auto"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-[-10px] md:bottom-[-25px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`transition-all duration-300 rounded-full ${selectedIndex === index
                                ? 'w-5 h-2 sm:w-8 sm:h-3 bg-[#022a55]'
                                : 'w-2 h-2 sm:w-3 sm:h-3 bg-[#022a55]/50'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;