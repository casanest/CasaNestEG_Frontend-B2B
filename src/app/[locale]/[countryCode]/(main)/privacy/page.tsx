'use client';

import React from 'react';
import { useLocale } from 'next-intl';

const Privacy = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const content = {
    title: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy',
    intro: isRTL
      ? 'في كازانيست، نولي خصوصية بياناتكم اهمية قصوى. تهدف هذه السياسة الى توضيح كيف نجمع ونحمي معلوماتكم الشخصية.'
      : 'We respect your privacy and are committed to protecting your personal data when you use our store.',
    collectTitle: isRTL ? 'المعلومات التي نجمعها' : 'Information We Collect',
    collect: isRTL
      ? [
          'الاسم الكامل ومعلومات الاتصال (الهاتف، البريد الالكتروني).',
          'عناوين التوصيل والتركيب (للمنازل او الشركات).',
          'بيانات النشاط التجاري (في حال التعاقد مع مؤسسات او جهات حكومية).',
        ]
      : [
          'Account details such as name, email, and phone number.',
          'Order, shipping, and payment information.',
          'Usage data such as pages you visit and preferences.',
        ],
    useTitle: isRTL ? 'كيف نستخدم بياناتكم؟' : 'How We Use Your Information',
    use: isRTL
      ? [
          'لتنفيذ الطلبات وتخصيص حلول التجهيزات المناسبة لمساحاتكم.',
          'لتحسين خدمات الدعم الفني وخدمات ما بعد البيع.',
          'لارسال تحديثات حول حالة الطلب او العروض الحصرية (بناء على موافقتكم).',
        ]
      : [
          'To process orders and provide shipping and support.',
          'To improve your shopping experience and personalize content.',
          'To send order updates and offers when you opt in.',
        ],
    protectionTitle: isRTL ? 'حماية البيانات' : 'Data Protection',
    protection: isRTL
      ? 'نطبق بروتوكولات امان متطورة (Encryption) لحماية بياناتكم من الوصول غير المصرح به. نحن لا نقوم ببيع او تاجير بياناتكم لاي اطراف ثالثة لاغراض تسويقية.'
      : 'We use modern security protocols to protect your data and do not sell or rent it for marketing purposes.',
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
            {content.collectTitle}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800 text-base sm:text-lg">
            {content.collect.map((item, idx) => (
              <li key={`collect-${idx}`} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
            {content.useTitle}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800 text-base sm:text-lg">
            {content.use.map((item, idx) => (
              <li key={`use-${idx}`} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
            {content.protectionTitle}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{content.protection}</p>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
