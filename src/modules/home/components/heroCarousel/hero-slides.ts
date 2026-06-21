export const getHeroSlides = (isRTL: boolean) => [
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