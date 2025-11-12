'use client';

import { useState } from 'react';
import Image from 'next/image';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { useLocale } from 'next-intl';

// 🧠 أنواع البيانات
type SubCategory = { label: string; href: string; children?: SubCategory[] };
type Category = { title: string; handle: string; subCategories: SubCategory[] };
type MenuItem = { title: string; handle: string; columns: Category[]; image?: string };

// 🧠 تحويل بيانات navigation القادمة من الـ backend إلى MenuItem[]
const mapNavigationToMegaMenu = (navItem: any, locale: string): MenuItem[] => {
    if (!navItem || !Array.isArray(navItem.category_children)) return [];

    const isArabic = locale === 'ar';

    const mapChildren = (children: any[]): SubCategory[] =>
        children.map((child) => {
            const label = isArabic ? child.name_ar || child.name : child.name_en || child.name;
            const handle = isArabic
                ? child.handle_ar || child.handle_en || child.handle
                : child.handle_en || child.handle_ar || child.handle;

            return {
                label,
                href: `${handle}`, // استخدام handle لبناء الرابط الصحيح
                children: child.category_children && child.category_children.length > 0 ? mapChildren(child.category_children) : [],
            };
        });

    return navItem.category_children.map((cat: any) => {
        const title = isArabic ? cat.name_ar || cat.name : cat.name_en || cat.name;
        const handle = isArabic ? cat.handle_ar || cat.handle_en || cat.handle : cat.handle_en || cat.handle_ar || cat.handle;

        return {
            title,
            handle, // إضافة handle هنا
            columns: [
                {
                    title,
                    handle,
                    subCategories: mapChildren(cat.category_children || []),
                },
            ],
            image: cat.image_url || cat.metadata?.image_url || undefined,
        };
    });
};

// 🧠 مكون فرعي لعرض التصنيفات الفرعية بشكل متكرر (recursive)
const SubCategoryList = ({ items }: { items: SubCategory[] }) => {
    if (!items || items.length === 0) return null;

    return (
        <ul className="text-sm text-gray-700 space-y-1 pl-4">
            {items.map((sub, idx) => (
                <li key={idx}>
                    <LocalizedClientLink href={sub.href} className="hover:text-blue-600 transition">
                        {sub.label}
                    </LocalizedClientLink>
                    {sub.children && sub.children.length > 0 && <SubCategoryList items={sub.children} />}
                </li>
            ))}
        </ul>
    );
};

// 🔢 عدد التصنيفات التي تظهر قبل "More"
const VISIBLE_CATEGORIES_COUNT = 9;

const MegaMenu = ({ navigation }: { navigation: any[] }) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const menuItems = mapNavigationToMegaMenu(navigation[0], locale);

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showMore, setShowMore] = useState(false);

    const visibleCategories = menuItems.slice(0, VISIBLE_CATEGORIES_COUNT);
    const hiddenCategories = menuItems.slice(VISIBLE_CATEGORIES_COUNT);

    return (
        <nav dir={isRTL ? 'rtl' : 'ltr'} className="hidden md:block bg-[#f5f8fc] relative z-10 w-full">
            <ul className="flex px-6 content-container border-b text-sm font-medium space-x-8 text-gray-700">
                {visibleCategories.map((menu, index) => (
                    <li
                        key={index}
                        className="px-4 py-4 cursor-pointer hover:text-[#043364] hover:bg-white hover:border-b-2 border-[#043364]"
                        onMouseEnter={() => setOpenIndex(index)}
                        onMouseLeave={() => setOpenIndex(null)}
                    >
                        {/* استخدم الـ handle هنا في الرابط */}
                        <LocalizedClientLink href={`${menu.handle}`} className="font-semibold">
                            {menu.title}
                        </LocalizedClientLink>

                        {openIndex === index && (
                            <div className="absolute left-0 top-full bg-white right-0 rounded-b-lg z-50 flex p-6 shadow-md overflow-hidden">
                                <div className="flex content-container flex-1 gap-12">
                                    {menu.columns.map((col, colIdx) => (
                                        <div key={colIdx} className="min-w-[180px]">
                                            {/* استخدم handle أيضاً هنا */}
                                            <h4 className="text-md font-semibold text-[#043364] mb-2">
                                                <LocalizedClientLink href={`${col.handle}`}>
                                                    {col.title} <span className="ml-1">›</span>
                                                </LocalizedClientLink>
                                            </h4>
                                            {/* عرض التصنيفات الفرعية بشكل متكرر */}
                                            <SubCategoryList items={col.subCategories} />
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
                                        {/* عنوان الـ menu */}
                                        <LocalizedClientLink href={`${menu.handle}`} className="font-semibold">
                                            {menu.title}
                                        </LocalizedClientLink>

                                        {openIndex === index + VISIBLE_CATEGORIES_COUNT && (
                                            <div className="absolute left-full top-0 bg-white p-6 rounded-b-md shadow-lg border z-50 flex">
                                                <div className="flex flex-1 gap-12">
                                                    {menu.columns.map((col, colIdx) => (
                                                        <div key={colIdx} className="min-w-[180px]">
                                                            <h4 className="text-md font-semibold text-[#043364] mb-2">
                                                                <LocalizedClientLink href={`${col.handle}`}>
                                                                    {col.title} <span className="ml-1">›</span>
                                                                </LocalizedClientLink>
                                                            </h4>
                                                            <SubCategoryList items={col.subCategories} />
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
