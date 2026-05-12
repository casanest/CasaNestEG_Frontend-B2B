import CategoryCard from './CategoryCard';

const CategoriesGrid = ({ locale }: { locale: string }) => {
    const isRTL = locale === 'ar';

    const categories = [
        {
            image:'/cat-1.jpg',
            title: isRTL ? 'أثاث منزلي' : 'Home Furniture',
            subtitle: isRTL
                ? 'تصاميم تناسب منزلك'
                : 'Elegant home designs',
            href: 'categories/home-furniture',
            button: isRTL ? 'تسوق الآن' : 'Shop Now',
        },
        {
            image: "/cat-2.jpg",
            title: isRTL ? 'أثاث مكتبي' : 'Office Furniture',
            subtitle: isRTL
                ? 'حلول مكتبية حديثة'
                : 'Modern office solutions',
            href: 'categories/office-furniture',
            button: isRTL ? 'تسوق الآن' : 'Shop Now',
        },
        {
            image: "/cat-3.jpg",
            title: isRTL ? 'أثاث الفنادق' : 'Hotel Furniture',
            subtitle: isRTL
                ? 'تصميمات فندقية فاخرة'
                : 'Luxury hotel furniture',
            href: 'categories/hotel-furniture',
            button: isRTL ? 'تسوق الآن' : 'Shop Now',
        },
        {
            image: "/cat-4.jpg",
            title: isRTL ? 'حلول متكاملة' : 'Integrated Solutions',
            subtitle: isRTL
                ? 'كل ما تحتاجه'
                : 'Everything you need',
            href: 'categories/integrated-solutions',
            button: isRTL ? 'تسوق الآن' : 'Shop Now',
        },
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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