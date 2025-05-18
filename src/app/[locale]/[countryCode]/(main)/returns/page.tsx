'use client';

import React from 'react';
import { useLocale } from 'next-intl';

const Returns = () => {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const content = {
        title: isRTL ? 'سياسة الإرجاع' : 'Return Policy',
        intro: isRTL
            ? 'نحن نسعى إلى رضاك التام. إذا لم تكن راضيًا عن المنتج، يمكنك إرجاعه بسهولة.'
            : `We aim for your complete satisfaction. If you're not happy with your product, you can easily return it.`,
        conditionsTitle: isRTL? 'شروط الإرجاع': 'Return Conditions',
        conditions: isRTL
            ? [
                'يجب أن يتم الإرجاع خلال 14 يومًا من تاريخ الاستلام.',
                'يجب أن يكون المنتج غير مستخدم وفي عبوته الأصلية.',
                'يجب إرفاق الفاتورة أو إثبات الشراء.',
            ]
            : [
                'Returns must be made within 14 days of delivery.',
                'Item must be unused and in its original packaging.',
                'Proof of purchase or receipt must be included.',
            ],
        processTitle: isRTL ? 'كيفية الإرجاع' : 'How to Return',
        process: isRTL
            ? [
                'تواصل مع خدمة العملاء لتقديم طلب الإرجاع.',
                'قم بتعبئة المنتج بأمان مع جميع الملحقات.',
                'سوف نستلم المنتج ونقوم برد المبلغ بعد التحقق.',
            ]
            : [
                'Contact customer support to request a return.',
                'Securely package the product with all accessories.',
                'We will collect the product and refund after inspection.',
            ],
        contact: isRTL
            ? 'للمساعدة، تواصل معنا عبر البريد الإلكتروني أو الهاتف.'
            : 'For assistance, contact us via email or phone.',
    };

    return (
        <section
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-10">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-[#043364]">
                    {content.title}
                </h1>
                <p className="mb-6 sm:mb-8 text-gray-700 text-base sm:text-lg leading-relaxed">
                    {content.intro}
                </p>

                <div className="mt-8 sm:mt-10">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
                        {content.conditionsTitle}
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-800 text-base sm:text-lg">
                        {content.conditions.map((item, idx) => (
                            <li key={`cond-${idx}`} className="leading-relaxed">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8 sm:mt-10">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
                        {content.processTitle}
                    </h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-800 text-base sm:text-lg">
                        {content.process.map((item, idx) => (
                            <li key={`proc-${idx}`} className="leading-relaxed">
                                {item}
                            </li>
                        ))}
                    </ol>
                </div>

                <p className="mt-8 sm:mt-10 text-gray-600 text-base sm:text-lg">
                    {content.contact}
                </p>
            </div>
        </section>
    );
};

export default Returns;