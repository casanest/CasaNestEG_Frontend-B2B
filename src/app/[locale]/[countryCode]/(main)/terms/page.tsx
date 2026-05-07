'use client';

import React from 'react';
import { useLocale } from 'next-intl';

const Terms = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const content = {
    title: isRTL ? 'الشروط والاحكام' : 'Terms & Conditions',
    intro: isRTL
      ? 'باستخدامكم لموقع وخدمات كازانيست، فانكم توافقون على الالتزام بالشروط والاحكام التالية:'
      : 'By using Casanest services, you agree to the following terms and conditions.',
    servicesTitle: isRTL ? 'طبيعة الخدمات' : 'Nature of Services',
    services: isRTL
      ? 'كازانيست تقدم خدمة توريد وتركيب حلول متكاملة. الاسعار المعلنة تشمل المنتجات، وقد تخضع رسوم التركيب والشحن لتقديرات تعتمد على حجم الباقة وموقع التنفيذ.'
      : 'Casanest provides integrated supply and installation solutions. Listed prices cover products; installation and shipping fees may vary by bundle size and location.',
    quotationsTitle: isRTL ? 'عروض الاسعار والطلبات الخاصة' : 'Quotations and Special Orders',
    quotations: isRTL
      ? 'بالنسبة لتجهيزات الشركات الكبرى والجهات الحكومية، تعتبر عروض الاسعار صالحة لمدة محددة تذكر في العرض، وتعد الاتفاقية ملزمة فور التوقيع عليها او سداد الدفعة المقدمة.'
      : 'For large companies and government entities, quotations are valid for the stated period and become binding upon signature or advance payment.',
    ipTitle: isRTL ? 'حقوق الملكية الفكرية' : 'Intellectual Property',
    ip: isRTL
      ? 'جميع المحتويات والتصاميم والشعارات الموجودة على الموقع هي ملك لشركة كازانيست. يمنع اقتباس او استخدام صور تنسيقات الغرف او تجهيزات المكاتب الخاصة بنا لاغراض تجارية دون اذن كتابي.'
      : 'All content, designs, and logos are owned by Casanest. Using room or office setup images for commercial purposes without written permission is prohibited.',
    liabilityTitle: isRTL ? 'المسؤولية القانونية' : 'Legal Responsibility',
    liability: isRTL
      ? 'كازانيست غير مسؤولة عن سوء استخدام الاجهزة التقنية او الاثاث بعد التركيب والتسليم الرسمي. نلتزم بضمان المنتجات وفقا لضمان الوكلاء والمصنعين الرسميين.'
      : 'Casanest is not liable for misuse of products after delivery and official handover. Product warranties follow authorized agents and manufacturers.',
    changesTitle: isRTL ? 'التعديلات' : 'Changes',
    changes: isRTL
      ? 'تحتفظ كازانيست بالحق في تعديل هذه الشروط في اي وقت لتتواكب مع التطورات القانونية والتجارية، ويعد استمرارك في استخدام الموقع موافقة على هذه التعديلات.'
      : 'Casanest reserves the right to update these terms at any time. Continued use of the site indicates acceptance of changes.',
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
            {content.servicesTitle}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{content.services}</p>
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
            {content.quotationsTitle}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{content.quotations}</p>
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
            {content.ipTitle}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{content.ip}</p>
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
            {content.liabilityTitle}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{content.liability}</p>
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#043364]">
            {content.changesTitle}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{content.changes}</p>
        </div>
      </div>
    </section>
  );
};

export default Terms;
