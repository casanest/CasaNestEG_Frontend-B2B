'use client';

import {
    ShieldCheck,
    Truck,
    Headphones,
    Wallet,
} from 'lucide-react';

const FeaturesStrip = ({ locale }: { locale: string }) => {
    const isRTL = locale === 'ar';

    const items = [
        {
            icon: Truck,
            title: isRTL ? 'توصيل مجاني' : 'Free Delivery',
            desc: isRTL
                ? 'للطلبات فوق 5000 ريال'
                : 'For orders over 5000 SAR',
        },
        {
            icon: ShieldCheck,
            title: isRTL ? 'ضمان شامل' : 'Warranty',
            desc: isRTL
                ? 'على جميع المنتجات'
                : 'On all products',
        },
        {
            icon: Wallet,
            title: isRTL ? 'دفع آمن' : 'Secure Payment',
            desc: isRTL
                ? 'خيارات دفع متعددة'
                : 'Multiple payment methods',
        },
        {
            icon: Headphones,
            title: isRTL ? 'دعم العملاء' : 'Customer Support',
            desc: isRTL
                ? 'خدمة 24/7'
                : '24/7 Support',
        },
    ];

    return (
        <section className="border-y border-gray-200 bg-white">
            <div className="grid grid-cols-2 lg:grid-cols-4">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-4 py-6 px-4 justify-center border-gray-200 lg:border-r last:border-none"
                    >
                        <item.icon className="w-9 h-9 text-[#022a55]" />

                        <div>
                            <h3 className="font-semibold text-sm lg:text-base">
                                {item.title}
                            </h3>

                            <p className="text-xs text-gray-500">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesStrip;