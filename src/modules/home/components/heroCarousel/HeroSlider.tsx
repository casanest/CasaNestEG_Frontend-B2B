'use client';

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";


type Slide = {
    image: string;
    alt: string;
    link: string;
};


const HeroSlider = ({
    slides,
    dir
}: {
    slides: Slide[];
    dir: string;
}) => {


    const isRTL = dir === "rtl";


    const options = useMemo(() => ({
        loop: true,
        direction: isRTL ? "rtl" : "ltr",
        align: "start" as const,
    }), [isRTL]);

    const autoplayRef = useRef<NodeJS.Timeout | null>(null);


    const [emblaRef, emblaApi] =
        useEmblaCarousel(options);



    const [selectedIndex, setSelectedIndex] =
        useState(0);



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

            setSelectedIndex(
                emblaApi.selectedScrollSnap()
            );

        };


        emblaApi.on(
            "select",
            onSelect
        );


        onSelect();


        return () => {
            emblaApi.off(
                "select",
                onSelect
            );
        };


    }, [emblaApi]);


    useEffect(() => {

        if (!emblaApi) return;


        autoplayRef.current = setInterval(() => {

            emblaApi.scrollNext();

        }, 5000);



        return () => {

            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
            }

        };


    }, [emblaApi]);


    return (

        <section
            dir={dir}
            className="
                relative
                w-full
                rounded-2xl
                overflow-hidden
                py-6
            "
        >


            <div
                ref={emblaRef}
                className="
                    overflow-hidden
                    rounded-2xl
                    shadow-lg
                "
            >


                <div className="flex ">


                    {
                        slides.map((slide, index) => (

                            <Link
                                key={index}
                                href={`/${slide.link}`}
                                className="
                                    relative
                                    min-w-full
                                    aspect-[1720/900]
                                    sm:aspect-[1720/520]
                                    block
                                "
                            >


                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    fill
                                    priority={index === 0}
                                    loading={
                                        index === 0
                                            ? "eager"
                                            : "lazy"
                                    }
                                    sizes="
                                    (max-width:768px) 100vw,
                                    1720px
                                    "
                                    className="object-cover"
                                />
                            </Link>
                        ))
                    }
                </div>
            </div>


            {/* arrows */}

            <div
                className="
                    absolute
                    inset-y-0
                    left-0
                    right-0
                    flex
                    items-center
                    justify-between
                    px-5
                    pointer-events-none
                    hidden
                    sm:flex
                "
            >


                <button
                    onClick={
                        isRTL ? scrollNext : scrollPrev
                    }
                    className="
                        pointer-events-auto
                        w-11
                        h-11
                        rounded-full
                        bg-white/90
                        flex
                        items-center
                        justify-center
                        shadow-lg
                    "
                >

                    <ChevronLeft size={20} />

                </button>




                <button
                    onClick={
                        isRTL ? scrollPrev : scrollNext
                    }
                    className="
                        pointer-events-auto
                        w-11
                        h-11
                        rounded-full
                        bg-white/90
                        flex
                        items-center
                        justify-center
                        shadow-lg
                    "   
                >

                    <ChevronRight size={20} />

                </button>



            </div>





            {/* dots */}

            <div
                className="
                    absolute
                    bottom-[0]
                    left-1/2
                    -translate-x-1/2
                    flex
                    gap-2
                "
            >


                {
                    slides.map((_, index) => (

                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`
                                rounded-full
                                transition-all
                                ${selectedIndex === index
                                        ?
                                        "w-8 h-3 bg-[#022a55]"
                                        :
                                        "w-3 h-3 bg-[#022a55]/50"
                                    }
                            `}
                        />
                    ))
                }
            </div>
        </section>
    );
};


export default HeroSlider;