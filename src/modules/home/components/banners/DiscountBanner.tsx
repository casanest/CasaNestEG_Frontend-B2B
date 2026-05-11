'use client';

import Image from 'next/image';

const DiscountBanner = ({ locale }: { locale: string }) => {
    const isRTL = locale === 'ar';

    return (
        <section className="relative overflow-hidden rounded-3xl bg-[#f5f5f5]">
            <div className="aspect-[1720/280] relative">
                <Image
                    src="/discount.jpg"
                    alt="discount"
                    fill
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute inset-0 flex items-center px-10 lg:px-20">
                    <div className="max-w-xl text-white">
                        <p className="mb-3 text-lg">
                            {isRTL
                                ? 'عروض حصرية لفترة محدودة'
                                : 'Limited Time Offers'}
                        </p>

                        <h2 className="text-4xl lg:text-6xl font-bold mb-5">
                            {isRTL
                                ? 'خصومات تصل إلى 30%'
                                : 'Discounts Up To 30%'}
                        </h2>

                        <button className="h-12 px-7 rounded-xl bg-white text-black font-medium">
                            {isRTL ? 'اكتشف المزيد' : 'Explore More'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DiscountBanner;