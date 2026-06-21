// 'use client';

import {
    ShieldCheck,
    Truck,
    Headphones,
    Wallet,
} from 'lucide-react';

type FeaturesStripProps = {
    locale: string;
    dir: string;
};

const FeaturesStrip = ({ locale, dir }: FeaturesStripProps) => {
    const isRTL = dir === 'rtl';

    const items = [
        {
            icon: Truck,
            title: isRTL ? 'شحن سريع' : 'Fast Shipping',
            desc: isRTL
                ? 'توصيل سريع إلى باب منزلك'
                : 'Quick delivery to your doorstep',
        },
        {
            icon: ShieldCheck,
            title: isRTL ? 'ضمان شامل' : 'Warranty',
            desc: isRTL
                ? 'ضمان على جميع المنتجات'
                : 'Warranty on all products',
        },
        {
            icon: Wallet,
            title: isRTL ? 'دفع آمن' : 'Secure Payment',
            desc: isRTL
                ? 'خيارات دفع متعددة وآمنة'
                : 'Multiple secure payment methods',
        },
        {
            icon: Headphones,
            title: isRTL ? 'دعم العملاء' : 'Customer Support',
            desc: isRTL
                ? 'خدمة دعم متاحة 24/7'
                : '24/7 customer support',
        },
    ];

    return (
        <section
            dir={isRTL ? 'rtl' : 'ltr'}
            className="border-y border-gray-200 bg-white"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-4">
                <div className="grid grid-cols-4 lg:grid-cols-4">
                    {items.map((item, idx) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={idx}
                                className={`
                  relative
                  flex flex-col
                  md:flex-row
                  items-center
                  justify-center
                                   text-center
                     md:text-start
                  gap-2
                  px-1
                  py-4
                  min-h-[95px]
                `}
                            >
                                {/* divider for desktop */}
                                {idx !== items.length - 1 && (
                                    <span
                                        className={`
                      absolute top-1/2 -translate-y-1/2
                      h-[55%] w-px bg-gray-200
                      ${isRTL ? 'left-0' : 'right-0'}
                    `}
                                    />
                                )}

                                <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#022a55]/5">
                                    <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-[#022a55]" />
                                </div>

                                <div>
                                    <h3 className="text-[11px] sm:text-sm font-semibold leading-tight text-gray-900">
                                        {item.title}
                                    </h3>

                                    <p className="hidden md:block mt-1 text-xs leading-relaxed text-gray-500">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesStrip;