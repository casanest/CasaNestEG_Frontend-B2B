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
        <div className="group overflow-hidden rounded-xl md:rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-[410/240] bg-[#fafafa]">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Desktop */}
            <div className="hidden md:flex flex-col items-center justify-center px-6 py-5 text-center bg-[#fafafa]">
                <h3 className="text-xl md:text-2xl font-bold text-[#152451] mb-2">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                    {subtitle}
                </p>

                <Link
                    href={href}
                    className="
            inline-flex
            items-center
            justify-center
            min-w-[150px]
            h-11
            rounded-lg
            border
            border-gray-300
            bg-white
            text-sm
            font-medium
            text-[#1f1f1f]
            transition-all
            duration-300
            hover:border-[#022a55]/40
            hover:text-[#022a55]
          "
                >
                    {button}
                </Link>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex flex-col items-center text-center px-3 py-3 bg-[#fafafa]">
                <h3 className="text-sm font-bold text-[#152451] leading-tight mb-1">
                    {title}
                </h3>

                <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                    {subtitle}
                </p>

                <Link
                    href={href}
                    className="
            inline-flex
            items-center
            justify-center
            px-4
            h-9
            rounded-md
            border
            border-gray-300
            bg-white
            text-xs
            font-medium
            text-[#1f1f1f]
            transition-all
            duration-300
          "
                >
                    {button}
                </Link>
            </div>
        </div>
    );
};

export default CategoryCard;