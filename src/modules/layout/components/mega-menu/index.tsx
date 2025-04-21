'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

type SubCategory = { label: string; href: string };
type Category = {
    title: string;
    subCategories: SubCategory[];
};

type MenuItem = {
    title: string;
    columns: Category[];
    image?: string;
};

const categories: MenuItem[] = [
    {
        title: 'Mobile, Tablet',
        columns: [
            {
                title: 'Mobile Accessories',
                subCategories: [
                    { label: 'Power Bank', href: '#' },
                    { label: 'Mobile Covers', href: '#' },
                    { label: 'Selfie Sticks', href: '#' },
                    { label: 'Ring Lights', href: '#' },
                    { label: 'Earphones', href: '#' },
                    { label: 'Chargers', href: '#' },
                    { label: 'Mobile Cables', href: '#' },
                    { label: 'Mobile Holder', href: '#' },
                    { label: 'Styli', href: '#' },
                ],
            },
            {
                title: 'Wearable Devices',
                subCategories: [
                    { label: 'Smart watches', href: '#' },
                    { label: 'Band', href: '#' },
                    { label: 'Strap', href: '#' },
                ],
            },
            {
                title: 'Phones & Tablet',
                subCategories: [
                    { label: 'Smart Phone', href: '#' },
                    { label: 'Tablet', href: '#' },
                    { label: 'Cell Phones (Buttons)', href: '#' },
                ],
            },
        ],
        image: '/assets/mega-mobile.png', // Your uploaded image path
    },
    {
        title: 'Computers & Laptops',
        columns: [
            {
                title: 'Computers',
                subCategories: [
                    { label: 'Desktop', href: '#' },
                    { label: 'Laptop', href: '#' },
                    { label: 'Gaming', href: '#' },
                    { label: 'Tablet', href: '#' },
                ],
            },
            {
                title: 'Computer Accessories',
                subCategories: [
                    { label: 'Mouse', href: '#' },
                    { label: 'Keyboard', href: '#' },
                    { label: 'Webcam', href: '#' },
                    { label: 'Headset', href: '#' },
                    { label: 'Microphone', href: '#' },
                    { label: 'Speakers', href: '#' },
                    { label: 'Printer', href: '#' },
                    { label: 'Scanner', href: '#' },
                ],
            },
            {
                title: 'Networking',
                subCategories: [
                    { label: 'Router', href: '#' },
                    { label: 'Switches', href: '#' },
                    { label: 'Modem', href: '#' },
                ],
            },
            {
                title: 'Storage Devices',
                subCategories: [
                    { label: 'External Hard Drive', href: '#' },
                    { label: 'USB Flash Drive', href: '#' },
                    { label: 'Memory Card', href: '#' },
                ],
            },
            {
                title: 'Software',
                subCategories: [
                    { label: 'Operating System', href: '#' },
                    { label: 'Antivirus', href: '#' },
                    { label: 'Office Suite', href: '#' },
                    { label: 'Graphic Design', href: '#' },
                    { label: 'Video Editing', href: '#' },
                ]
            }
        ],
        image: '/assets/mega-computer.png', // Your uploaded image path
    },
    {
        title: 'Smart Home',
        columns: [
            {
                title: 'Smart Home',
                subCategories: [
                    { label: 'Smart Home', href: '#' },
                    { label: 'Smart Home', href: '#' },
                    { label: 'Smart Home', href: '#' },
                    { label: 'Smart Home', href: '#' },
                ],
            },
        ],
        image: '/assets/mega-smart-home.png', // Your uploaded image path
    },
    {
        title: 'Gaming',
        columns: [
            {
                title: 'Gaming',
                subCategories: [
                    { label: 'Gaming', href: '#' },
                    { label: 'Gaming', href: '#' },
                    { label: 'Gaming', href: '#' },
                    { label: 'Gaming', href: '#' },
                ],
            },
        ],
        image: '/assets/mega-gaming.png', // Your uploaded image path
    },
    {
        title: 'Accessories',
        columns: [
            {
                title: 'Accessories',
                subCategories: [
                    { label: 'Accessories', href: '#' },
                    { label: 'Accessories', href: '#' },
                    { label: 'Accessories', href: '#' },
                    { label: 'Accessories', href: '#' },
                ],
            },
        ],
        image: '/assets/mega-accessories.png', // Your uploaded image path
    },
    {
        title: 'Wearable Devices',
        columns: [
            {
                title: 'Wearable Devices',
                subCategories: [
                    { label: 'Wearable Devices', href: '#' },
                    { label: 'Wearable Devices', href: '#' },
                    { label: 'Wearable Devices', href: '#' },
                    { label: 'Wearable Devices', href: '#' },
                ],
            },
        ],
        image: '/assets/mega-wearable.png', // Your uploaded image path
    }
]

// Cutoff for visible categories before showing "More"
const VISIBLE_CATEGORIES_COUNT = 4;

const MegaMenu = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showMore, setShowMore] = useState(false);

    const visibleCategories = categories.slice(0, VISIBLE_CATEGORIES_COUNT);
    const hiddenCategories = categories.slice(VISIBLE_CATEGORIES_COUNT);

    return (
        <nav className="hidden md:block bg-white shadow relative z-50 w-full">
            <ul className="flex px-6 py-2 border-b text-sm font-medium text-[#043364]">
                {visibleCategories.map((menu, index) => (
                    <li
                        key={index}
                        className="relative px-4 py-2 cursor-pointer hover:text-red-600"
                        onMouseEnter={() => setOpenIndex(index)}
                        onMouseLeave={() => setOpenIndex(null)}
                    >
                        {menu.title}
                        {openIndex === index && (
                            <div className="absolute left-0 top-full w-full max-w-screen-xl bg-white rounded-b-lg z-50 flex p-6 shadow-md mx-auto">
                                {/* Subcategories */}
                                <div className="flex flex-1 gap-12">
                                    {menu.columns.map((col, colIdx) => (
                                        <div key={colIdx} className="min-w-[180px]">
                                            <h4 className="text-md font-semibold text-[#043364] mb-2">
                                                {col.title} <span className="ml-1">›</span>
                                            </h4>
                                            <ul className="text-sm text-gray-700 space-y-1">
                                                {col.subCategories.map((sub, subIdx) => (
                                                    <li key={subIdx}>
                                                        <Link href={sub.href} className="hover:text-blue-600 transition">
                                                            {sub.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Image */}
                                {menu.image && (
                                    <div className="flex-shrink-0 ml-6">
                                        <Image
                                            src={menu.image}
                                            alt="Promo"
                                            width={300}
                                            height={200}
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}

                {/* More Dropdown */}
                {hiddenCategories.length > 0 && (
                    <li
                        className="relative px-4 py-2 cursor-pointer hover:text-red-600"
                        onMouseEnter={() => setShowMore(true)}
                        onMouseLeave={() => {
                            setShowMore(false);
                            setOpenIndex(null);
                        }}
                    >
                        More
                        {showMore && (
                            <ul className="absolute left-0 top-full w-56 bg-white shadow-lg rounded-md py-2 z-50">
                                {hiddenCategories.map((menu, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 hover:text-red-600"
                                        onMouseEnter={() => setOpenIndex(index + VISIBLE_CATEGORIES_COUNT)}
                                        onMouseLeave={() => setOpenIndex(null)}
                                    >
                                        {menu.title}
                                        {/* Optional nested submenu for "More" */}
                                        {openIndex === index + VISIBLE_CATEGORIES_COUNT && (
                                            <div className="absolute left-full top-0 bg-white w-[1000px] p-6 rounded-md shadow-lg z-50 flex">
                                                <div className="flex flex-1 gap-12">
                                                    {menu.columns.map((col, colIdx) => (
                                                        <div key={colIdx} className="min-w-[180px]">
                                                            <h4 className="text-md font-semibold text-[#043364] mb-2">
                                                                {col.title} <span className="ml-1">›</span>
                                                            </h4>
                                                            <ul className="text-sm text-gray-700 space-y-1">
                                                                {col.subCategories.map((sub, subIdx) => (
                                                                    <li key={subIdx}>
                                                                        <Link href={sub.href} className="hover:text-blue-600 transition">
                                                                            {sub.label}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>

                                                {menu.image && (
                                                    <div className="flex-shrink-0 ml-6">
                                                        <Image
                                                            src={menu.image}
                                                            alt="Promo"
                                                            width={400}
                                                            height={260}
                                                            className="object-contain rounded-lg"
                                                        />

                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default MegaMenu;
