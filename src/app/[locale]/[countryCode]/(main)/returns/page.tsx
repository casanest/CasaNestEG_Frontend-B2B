'use client';

import React from 'react';
import { useLocale } from 'next-intl';

const Returns = () => {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const content = {
        title: isRTL ? 'سياسة الإرجاع والاستبدال' : 'Return & Refund Policy',
        intro: isRTL
            ? 'تلتزم كازانيست بتقديم منتجات وحلول تلتزم بأعلى معايير الجودة. ولأننا نقدم حلولاً متكاملة تشمل اثاثاً وتقنيات واجهزة، فان سياسة الارجاع لدينا مصممة لضمان حقوق العميل مع الحفاظ على سلامة المعايير الفنية.'
            : `We aim for your complete satisfaction. If you're not happy with your product, you can easily return it.`,
        conditionsTitle: isRTL ? 'اولا: شروط الارجاع العامة' : 'General Return Conditions',
        conditions: isRTL
            ? [
                'يحق للعميل طلب الارجاع او الاستبدال خلال 14 يوما من تاريخ الاستلام، بشرط ان يكون المنتج بحالته الاصلية، غير مستخدم، وفي تغليفه الاصلي.',
                'في حال كانت المنتجات جزءا من باقة تجهيز متكاملة، يجب ارجاع كامل عناصر الباقة لضمان استحقاق الخصومات المرتبطة بها، الا في حالات العيوب المصنعية لقطع محددة.',
            ]
            : [
                'Returns or exchanges are accepted within 14 days of delivery if the item is unused and in its original packaging.',
                'If items are part of a setup bundle, the entire bundle must be returned to keep bundle discounts, except for verified manufacturing defects in specific items.',
            ],
        techTitle: isRTL ? 'ثانيا: المنتجات التقنية والكهربائية' : 'Technical and Electrical Products',
        tech: isRTL
            ? 'لا يتم قبول ارجاع الاجهزة التقنية (اجهزة الكمبيوتر، الخوادم، الطابعات) في حال تم فتح الغلاف الاصلي او تفعيل انظمة التشغيل، الا اذا وجد بها عيب مصنعي موثق.'
            : 'Technical devices (computers, servers, printers) are not returnable once opened or activated, unless a documented manufacturing defect is confirmed.',
        defectsTitle: isRTL ? 'ثالثا: العيوب المصنعية والتلف اثناء النقل' : 'Manufacturing Defects and Shipping Damage',
        defects: isRTL
            ? 'تتحمل كازانيست كامل المسؤولية عن اي تلف ناتج عن عمليات الشحن او التركيب التي يقوم بها فريقنا. ويتم استبدال القطع المتضررة فورا دون اي تكاليف اضافية على العميل.'
            : 'Casanest is fully responsible for damage caused by our shipping or installation. Damaged items are replaced immediately at no additional cost.',
        refundTitle: isRTL ? 'رابعا: الية رد الاموال' : 'Refund Process',
        refund: isRTL
            ? 'يتم رد المبالغ عبر نفس وسيلة الدفع الاصلية خلال 7 الى 14 يوم عمل بعد فحص المنتجات المرتجعة والتأكد من سلامتها.'
            : 'Refunds are issued to the original payment method within 7 to 14 business days after inspection.',
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
                        {content.techTitle}
                    </h2>
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                        {content.tech}
                    </p>
                </div>

                <div className="mt-8 sm:mt-10">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
                        {content.defectsTitle}
                    </h2>
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                        {content.defects}
                    </p>
                </div>

                <div className="mt-8 sm:mt-10">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
                        {content.refundTitle}
                    </h2>
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                        {content.refund}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Returns;