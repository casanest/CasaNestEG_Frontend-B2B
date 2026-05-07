'use client';

import React from 'react';
import { useLocale } from 'next-intl';

const Cookies = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const content = {
    title: isRTL ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy',
    intro: isRTL
      ? 'نستخدم في موقع كازانيست ملفات تعريف الارتباط لتعزيز تجربتكم الرقمية.'
      : 'We use cookies to enhance your digital experience on Casanest.',
    reasonsTitle: isRTL ? 'لماذا نستخدم الكوكيز؟' : 'Why We Use Cookies',
    reasons: isRTL
      ? [
          'تحسين التجربة: لحفظ تفضيلاتكم عند اختيار باقات التجهيز وتسهيل عملية تسجيل الدخول.',
          'التحليل: لفهم كيفية تفاعل الزوار مع اقسام الموقع، مما يساعدنا في تطوير عروضنا وحلولنا التقنية.',
          'الاداء: لضمان سرعة تحميل الصفحات وعرض صور المنتجات عالية الجودة بشكل سلس.',
        ]
      : [
          'Experience: to remember your preferences and make sign-in smoother.',
          'Analytics: to understand how visitors interact with the site.',
          'Performance: to keep pages fast and product images smooth.',
        ],
    controlTitle: isRTL ? 'التحكم في ملفات الارتباط' : 'Managing Cookies',
    control: isRTL
      ? 'يمكنكم تعديل اعدادات المتصفح الخاص بكم لرفض ملفات تعريف الارتباط او تنبيهكم عند ارسالها. ومع ذلك، يرجى ملاحظة ان بعض ميزات الموقع (مثل سلة المشتريات او محاكي التجهيزات) قد لا تعمل بشكل صحيح بدون هذه الملفات.'
      : 'You can adjust your browser settings to reject cookies or alert you when they are sent. Some site features may not work properly without them.',
    closing: isRTL
      ? 'الحل الامثل.. لمساحة متكاملة.'
      : 'The optimal solution for a complete space.',
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
            {content.reasonsTitle}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800 text-base sm:text-lg">
            {content.reasons.map((item, idx) => (
              <li key={`reasons-${idx}`} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
            {content.controlTitle}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{content.control}</p>
        </div>

        <p className="mt-10 text-sm sm:text-base text-gray-500 text-center">
          Casanest | كازانيست
        </p>
        <p className="mt-2 text-sm sm:text-base text-gray-600 text-center">{content.closing}</p>
      </div>
    </section>
  );
};

export default Cookies;
