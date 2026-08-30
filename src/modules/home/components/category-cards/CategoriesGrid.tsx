import CategoryCard from './CategoryCard';

const CategoriesGrid = ({ locale, dir }: { locale: string; dir: string }) => {
    const isRTL = dir === 'rtl';
 
    const categories = [
        {
            image: '/cat-1.webp',
            title: isRTL ? 'أثاث منزلي' : 'Home Furniture',
            subtitle: isRTL
                ? 'تصاميم تناسب منزلك'
                : 'Elegant home designs',
            href: 'categories/home-furniture',
            button: isRTL ? 'تسوق الآن' : 'Shop Now',
        },
        {
            image: '/cat-2.webp',
            title: isRTL ? 'أثاث مكتبي' : 'Office Furniture',
            subtitle: isRTL
                ? 'حلول مكتبية حديثة'
                : 'Modern office solutions',
            href: 'categories/office-furniture',
            button: isRTL ? 'تسوق الآن' : 'Shop Now',
        },
        {
            image: '/cat-3.webp',
            title: isRTL ? 'أثاث فندقي' : 'Hotel Furniture',
            subtitle: isRTL
                ? 'تصميمات فندقية فاخرة'
                : 'Luxury hotel furniture',
            href: 'categories/hotel-furniture',
            button: isRTL ? 'تسوق الآن' : 'Shop Now',
        },
        {
            image: '/cat-4.webp',
            title: isRTL ? 'حلول متكاملة' : 'Integrated Solutions',
            subtitle: isRTL
                ? 'كل ما تحتاجه'
                : 'Everything you need',
            href: 'categories/integrated-solutions',
            button: isRTL ? 'تسوق الآن' : 'Shop Now',
        },
    ];

    return (
        <section className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6 py-6">
            {categories.map((item, idx) => (
                <CategoryCard
                    key={idx}
                    image={item.image}
                    title={item.title}
                    subtitle={item.subtitle}
                    href={item.href}
                    button={item.button}
                />
            ))}
        </section>
    );
};

export default CategoriesGrid;