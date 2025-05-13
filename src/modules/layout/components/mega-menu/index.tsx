'use client';

import { useState } from 'react';
import Image from 'next/image';
import LocalizedClientLink from '@modules/common/components/localized-client-link'

// أنواع البيانات
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

// 🧠 تحويل بيانات navigation القادمة من backend إلى MenuItem[]
const mapNavigationToMegaMenu = (navItem: any): MenuItem[] => {
    if (!navItem || !Array.isArray(navItem.category_children)) return [];

    return navItem.category_children.map((cat: any) => ({
        title: cat.name,
        columns: [
            {
                title: cat.name,
                subCategories: (cat.category_children || []).map((child: any) => ({
                    label: child.name,
                    href: child.handle.startsWith('/') ? child.handle : `/categories/${child.handle}`,
                })),
            },
        ],
        image: undefined, // يمكنك تعديل هذا لاحقًا لو أردت إضافة صور
    }));
};

// عدد التصنيفات التي تظهر قبل "More"
const VISIBLE_CATEGORIES_COUNT = 9;

const MegaMenu = ({ navigation }: { navigation: any[] }) => {
    const menuItems = mapNavigationToMegaMenu(navigation[0]);

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showMore, setShowMore] = useState(false);

    const visibleCategories = menuItems.slice(0, VISIBLE_CATEGORIES_COUNT);
    const hiddenCategories = menuItems.slice(VISIBLE_CATEGORIES_COUNT);

    return (
        <nav className="hidden md:block bg-white shadow relative z-10 w-full">
            <ul className="flex px-6  bg-gray-50 border-b text-sm font-medium space-x-8 text-gray-700">
                {visibleCategories.map((menu, index) => (
                    <li
                        key={index}
                        className="px-4 py-4 cursor-pointer  hover:text-[#043364] hover:bg-white hover:border-b-2 border-[#043364] "
                        onMouseEnter={() => setOpenIndex(index)}
                        onMouseLeave={() => setOpenIndex(null)}
                    >
                        {menu.title}
                        {openIndex === index && (
                            <div className="absolute left-0 top-full bg-white right-0 rounded-b-lg z-50 flex p-6 shadow-md overflow-hidden">
                                <div className="flex flex-1 gap-12">
                                    {menu.columns.map((col, colIdx) => (
                                        <div key={colIdx} className="min-w-[180px]">
                                            <h4 className="text-md font-semibold text-[#043364] mb-2">
                                                <LocalizedClientLink href={`/categories/${col.title.toLowerCase()}`} >
                                                    {col.title} <span className="ml-1">›</span>
                                                </LocalizedClientLink>
                                            </h4>
                                            <ul className="text-sm text-gray-700 space-y-1">
                                                {col.subCategories.map((sub, subIdx) => (
                                                    <li key={subIdx}>
                                                        <LocalizedClientLink href={sub.href} className="hover:text-blue-600 transition">
                                                            {sub.label}
                                                        </LocalizedClientLink>
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
                        className="relative px-4 py-4 cursor-pointer hover:text-red-600"
                        onMouseEnter={() => setShowMore(true)}
                        onMouseLeave={() => {
                            setShowMore(false);
                            setOpenIndex(null);
                        }}
                    >
                        More
                        {showMore && (
                            <ul className="absolute left-0 top-full w-56 bg-white shadow-lg rounded-b-md border py-2 z-50">
                                {hiddenCategories.map((menu, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 hover:text-red-600 relative"
                                        onMouseEnter={() => setOpenIndex(index + VISIBLE_CATEGORIES_COUNT)}
                                        onMouseLeave={() => setOpenIndex(null)}
                                    >
                                        {menu.title}
                                        {openIndex === index + VISIBLE_CATEGORIES_COUNT && (
                                            <div className="absolute left-full top-0 bg-white p-6 rounded-b-md shadow-lg border z-50 flex">
                                                <div className="flex flex-1 gap-12">
                                                    {menu.columns.map((col, colIdx) => (
                                                        <div key={colIdx} className="min-w-[180px]">
                                                            <h4 className="text-md font-semibold text-[#043364] mb-2">
                                                                {col.title} <span className="ml-1">›</span>
                                                            </h4>
                                                            <ul className="text-sm text-gray-700 space-y-1">
                                                                {col.subCategories.map((sub, subIdx) => (
                                                                    <li key={subIdx}>
                                                                        <LocalizedClientLink href={sub.href} className="hover:text-blue-600 transition">
                                                                            {sub.label}
                                                                        </LocalizedClientLink>
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
                            </ul>
                        )}
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default MegaMenu;
