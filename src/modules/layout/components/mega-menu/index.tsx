'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    normalizeProductImageUrl,
    shouldUseUnoptimizedImage,
} from '@lib/util/product-image-url';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { useLocale } from 'next-intl';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// --- Types ---
type SubCategory = { label: string; href: string; children?: SubCategory[] };
type CategoryColumn = { title: string; handle: string; category_children: SubCategory[] };
type MenuItem = { title: string; handle: string; columns: CategoryColumn[]; image?: string };

const mapNavigationToMegaMenu = (categories: any[], locale: string): MenuItem[] => {
    const isArabic = locale === 'ar';

    return categories.map((cat: any) => {
        // Level 1 = parent category (name_en/name_ar)
        const title = isArabic ? cat.name_ar || cat.name_en : cat.name_en || cat.name_ar
        const handle = cat.handle_en || cat.handle_ar || cat.handle || ''

        // Level 2 → columns
        const columns: CategoryColumn[] = (cat.category_children || []).map((child: any) => {
            const colTitle = isArabic ? child.name_ar || child.name_en : child.name_en || child.name_ar
            const colHandle = child.handle_en || child.handle_ar || child.handle || ''

            // Level 3 → sub-links
            const subChildren: SubCategory[] = (child.category_children || []).map((sub: any) => ({
                label: isArabic ? sub.name_ar || sub.name_en : sub.name_en || sub.name_ar,
                href: sub.handle_en || sub.handle_ar || sub.handle || '',
                children: [],
            }))

            return { title: colTitle, handle: colHandle, category_children: subChildren }
        })

        const rawImage = cat.image_url as string | undefined
        return {
            title,
            handle,
            columns,
            image: rawImage ? normalizeProductImageUrl(rawImage) : undefined,
        }
    })
}


// const mapNavigationToMegaMenu = (navigation: any[], locale: string): MenuItem[] => {
//     const isArabic = locale === 'ar';

//     return navigation.map((navItem: any) => {
//         // Top level: name (not name_en/name_ar), handle
//         const title = navItem.name || ''
//         const handle = navItem.handle || ''

//         // category_children = Level 1 items → become columns
//         const columns: CategoryColumn[] = (navItem.category_children || []).map((cat: any) => {
//             // Level 1 has name_en/name_ar
//             const colTitle = isArabic ? cat.name_ar || cat.name_en || cat.name : cat.name_en || cat.name_ar || cat.name
//             const colHandle = isArabic ? cat.handle_ar || cat.handle_en || cat.handle : cat.handle_en || cat.handle_ar || cat.handle || ''

//             // Level 2 → sub-links
//             const subChildren: SubCategory[] = (cat.category_children || []).map((sub: any) => ({
//                 label: isArabic ? sub.name_ar || sub.name_en || sub.name : sub.name_en || sub.name_ar || sub.name,
//                 href: isArabic ? sub.handle_ar || sub.handle_en || sub.handle : sub.handle_en || sub.handle_ar || sub.handle || '',
//                 children: (sub.category_children || []).map((deep: any) => ({
//                     label: isArabic ? deep.name_ar || deep.name_en || deep.name : deep.name_en || deep.name_ar || deep.name,
//                     href: isArabic ? deep.handle_ar || deep.handle_en || deep.handle : deep.handle_en || deep.handle_ar || deep.handle || '',
//                 })),
//             }))

//             return { title: colTitle, handle: colHandle, category_children: subChildren }
//         })

//         // Get image from first category_child that has one
//         const image = navItem.category_children?.find((c: any) => c.image_url)?.image_url || undefined

//         return { title, handle, columns, image }
//     })
// }
const MegaMenu = ({ navigation }: { navigation: any[] }) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    // const menuItems = mapNavigationToMegaMenu(navigation, locale);
    // ✅ بعد — خد الـ category_children من أول item (Shop)
    const shopItem = navigation?.find((item: any) => item.handle === '/store' && item.category_children?.length)
    const menuItems = mapNavigationToMegaMenu(shopItem?.category_children || [], locale)
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // ✅ Debug
    console.log('MegaMenu navigation:', navigation)

    // ✅ Guard against empty/undefined
    if (!navigation || navigation.length === 0) return null

    // const menuItems = mapNavigationToMegaMenu(navigation, locale);

    // ✅ Debug
    console.log('MegaMenu items:', menuItems)
    const LinksFirst = [
        {
            title_en: 'Home',
            title_ar: 'الرئيسية',
            href: '/'
        },
        {
            title_en: 'Integrated Solutions',
            title_ar: 'الحلول المتكاملة',
            href: '/categories/integrated-solutions'
        }
    ]
    const LinksSecond = [
        {
            title_en: 'Offers',
            title_ar: 'العروض',
            href: '/collections/sale'
        },
        {
            title_en: 'Our Services',
            title_ar: 'خدماتنا',
            href: '/our-services'
        },
        {
            title_en: 'Contact Us',
            title_ar: 'اتصل بنا',
            href: '/contact'
        }
    ]
    return (
        <nav dir={isRTL ? 'rtl' : 'ltr'} className="hidden md:block  border-b relative z-50 w-full shadow-sm bg-gray-100">
            <div className="content-container mx-auto">
                <ul className="flex items-center justify-start text-md font-bold text-gray-700 text-center">
                    {LinksFirst.map((link, idx) => (
                        <li key={idx}>
                            <LocalizedClientLink
                                href={link.href}
                                className="block px-4 py-4 text-md transition-colors hover:text-[#043364] border-b-2 border-transparent  hover:border-[#043364] hover:bg-gray-50 min-w-[120px]"
                            >
                                {isRTL ? link.title_ar : link.title_en}
                            </LocalizedClientLink>
                        </li>
                    ))}
                    {menuItems.slice(0, 5).map((menu, index) => (
                        <li
                            key={index}
                            className="group"
                            onMouseEnter={() => menu.columns.length > 0 ? setOpenIndex(index) : null}
                            onMouseLeave={() => setOpenIndex(null)}
                        >
                            <LocalizedClientLink
                                href={`${menu.handle}`}
                                className={`block px-4 py-4 text-md transition-colors  hover:text-[#043364] border-b-2 border-transparent  hover:border-[#043364] hover:bg-gray-50 min-w-[120px]`}
                            >
                                {menu.title}
                            </LocalizedClientLink>


                            {/* Mega Menu Dropdown */}
                            {openIndex === index && (
                                <>
                                    <div
                                        className="fixed inset-x-0 top-[300px] bottom-0 bg-black/20 backdrop-blur-sm z-40"
                                        onMouseEnter={() => setOpenIndex(null)}
                                        onClick={() => setOpenIndex(null)}
                                    />
                                    <div className="absolute pb-8 z-50 left-0 h-[calc(100vh-300px)] overflow-y-auto right-0 top-full w-full text-start bg-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="content-container mx-auto flex p-8 gap-8 justify-between">



                                        {/* Columns Section */}
                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                                            {menu.columns.map((col, colIdx) => (
                                                <div key={colIdx} className="space-y-4">
                                                    <LocalizedClientLink
                                                        href={`${col.handle}`}
                                                        className="flex items-center text-md font-bold font-black text-[#043364] hover:underline group/title"
                                                    >
                                                        {col.title}
                                                        {isRTL ? <ChevronLeft size={14} className="mr-1" /> : <ChevronRight size={14} className="ml-1" />}
                                                    </LocalizedClientLink>

                                                    <ul className="space-y-2">
                                                        {col.category_children.map((sub, subIdx) => (
                                                            <li key={subIdx}>
                                                                <LocalizedClientLink
                                                                    href={sub.href}
                                                                    className="text-md text-gray-600 hover:text-[#043364] transition-colors block py-0.5"
                                                                >
                                                                    {sub.label}
                                                                </LocalizedClientLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Image Section (Side) */}
                                        {menu.image && (
                                            <div className="w-1/4 flex-shrink-0 relative h-[300px] rounded-xl overflow-hidden hidden lg:block">
                                                <Image
                                                    src={menu.image}
                                                    alt={menu.title}
                                                    fill
                                                    sizes="(min-width: 1024px) 25vw, 0px"
                                                    unoptimized={shouldUseUnoptimizedImage(menu.image)}
                                                    className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Link */}
                                    {/* <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                                        <LocalizedClientLink
                                            href={`/categories/${menu.handle}`}
                                            className="text-xs font-bold text-gray-500 hover:text-[#043364] flex items-center justify-center gap-1"
                                        >
                                            {isRTL ? 'عرض مجموعة ' : 'View all '} {menu.title}
                                            {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                                        </LocalizedClientLink>
                                    </div> */}
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                    {LinksSecond.map((link, idx) => (
                        <li key={idx}>
                            <LocalizedClientLink
                                href={link.href}
                                className="block px-4 py-4 text-md transition-colors hover:text-[#043364] border-b-2 border-transparent  hover:border-[#043364] hover:bg-gray-50 min-w-[120px] "
                            >
                                {isRTL ? link.title_ar : link.title_en}
                            </LocalizedClientLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default MegaMenu;