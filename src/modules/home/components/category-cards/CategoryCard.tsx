'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
    image: string;
    title: string;
    subtitle: string;
    href: string;
    button: string;
};

const CategoryCard = ({
    image,
    title,
    subtitle,
    href,
    button,
}: Props) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-[#f8f8f8]">
            <div className="aspect-[410/320] relative">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute bottom-0 p-6 w-full">
                <div className="bg-white/90 backdrop-blur-md rounded-xl p-4">
                    <h3 className="text-xl font-bold mb-1">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                        {subtitle}
                    </p>

                    <Link
                        href={href}
                        className="inline-flex items-center justify-center px-5 h-11 rounded-lg bg-[#022a55] text-white text-sm font-medium hover:bg-[#011933] transition"
                    >
                        {button}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;