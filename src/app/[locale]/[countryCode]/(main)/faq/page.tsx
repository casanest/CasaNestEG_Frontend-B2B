import { Metadata } from "next"
import { getLocale } from "next-intl/server"
import FAQAccordion, {
  type FAQItem,
  type FAQCategory,
} from "@modules/faq/components/faq-accordion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQs",
  description: "Find answers about our products, services, and how we work with you.",
}

export default async function FAQPage() {
  const locale = await getLocale()
  const isRTL = locale === "ar"

  const categories: FAQCategory[] = [
    { id: "ordering", label: isRTL ? "الطلبات والتسعير" : "Ordering & Quotes" },
    { id: "products", label: isRTL ? "المنتجات والكتالوج" : "Products & Catalog" },
    { id: "delivery", label: isRTL ? "التوصيل والتركيب" : "Delivery & Installation" },
    { id: "solutions", label: isRTL ? "باقات الحلول" : "Solution Packages" },
    { id: "payments", label: isRTL ? "المدفوعات والشروط" : "Payments & Terms" },
  ]

  const faqItems: FAQItem[] = [
    {
      id: "1",
      category: "ordering",
      question: isRTL
        ? "كيف تعمل عملية الاستفسار؟"
        : "How does the inquiry process work?",
      answer: isRTL
        ? "تصفح كتالوجنا أو اختر باقة حلول جاهزة، أضف المنتجات إلى قائمة الأسعار، وأرسل استفسارك. يراجع فريقنا طلبك ويرسل لك تسعيرًا تفصيليًا — لا يلزم أي دفع مقدم."
        : "Browse our catalog or choose a pre-assembled Solution Package, add items to your Quote List, and submit your inquiry. Our team reviews your request and sends detailed pricing — no payment is required upfront.",
    },
    {
      id: "2",
      category: "ordering",
      question: isRTL
        ? "هل هناك حد أدنى لكمية الطلب؟"
        : "Is there a minimum order quantity?",
      answer: isRTL
        ? "لا يوجد حد أدنى ثابت لكمية الطلب. نحن نتعامل مع الطلبات الصغيرة والكبيرة على حد سواء، من القطع الفردية إلى المشاريع واسعة النطاق."
        : "There is no fixed minimum order quantity. We handle both small and large orders, from individual items to large-scale projects.",
    },
    {
      id: "3",
      category: "delivery",
      question: isRTL
        ? "هل تقدمون خدمة التوصيل والتركيب؟"
        : "Do you offer installation and delivery?",
      answer: isRTL
        ? "نعم. توفر كازانست خدمة التوصيل والتركيب الاحترافي في جميع أنحاء مصر. تعتمد مواعيد وتكاليف التوصيل على حجم الطلب والموقع — سيتم تضمين ذلك في عرض السعر الخاص بك."
        : "Yes. Casanest provides delivery and professional installation across Egypt. Delivery timelines and costs depend on the order size and location — our team will include this in your quote.",
    },
    {
      id: "4",
      category: "solutions",
      question: isRTL
        ? "هل يمكنني تخصيص باقة الحلول؟"
        : "Can I customize a Solution Package?",
      answer: isRTL
        ? "نعم، يمكن تخصيص جميع باقات الحلول لتلبية احتياجاتك الخاصة. تواصل مع فريقنا لمناقشة التعديلات والإضافات."
        : "Yes, all Solution Packages can be customized to meet your specific needs. Contact our team to discuss modifications and additions.",
    },
    {
      id: "5",
      category: "solutions",
      question: isRTL
        ? "ما هي القطاعات التي تخدمونها؟"
        : "What industries do you serve?",
      answer: isRTL
        ? "نخدم مجموعة واسعة من القطاعات بما في ذلك المكاتب والتعليم والرعاية الصحية والضيافة والمساحات السكنية والمزيد."
        : "We serve a wide range of industries including offices, education, healthcare, hospitality, residential spaces, and more.",
    },
    {
      id: "6",
      category: "ordering",
      question: isRTL
        ? "كم يستغرق استلام عرض السعر؟"
        : "How long does it take to receive a quote?",
      answer: isRTL
        ? "عادةً ما يرسل فريقنا عرض السعر خلال 24 إلى 48 ساعة عمل من استلام استفسارك، اعتمادًا على حجم وتعقيد الطلب."
        : "Our team typically sends a quote within 24 to 48 business hours of receiving your inquiry, depending on the size and complexity of the order.",
    },
    {
      id: "7",
      category: "products",
      question: isRTL
        ? "هل تقدمون ضمانًا على المنتجات؟"
        : "Do you offer warranties on products?",
      answer: isRTL
        ? "نعم، معظم منتجاتنا تأتي مع ضمان من الشركة المصنعة. تختلف مدة الضمان حسب المنتج والعلامة التجارية. يرجى الرجوع إلى تفاصيل المنتج أو التواصل معنا لمعلومات الضمان المحددة."
        : "Yes, most of our products come with a manufacturer warranty. Warranty periods vary by product and brand. Please refer to the product details or contact us for specific warranty information.",
    },
    {
      id: "8",
      category: "products",
      question: isRTL
        ? "هل يمكنني زيارة المعرض قبل الطلب؟"
        : "Can I visit a showroom before ordering?",
      answer: isRTL
        ? "نعم، نرحب بزيارتك لمعرضنا. يرجى التواصل معنا لتحديد موعد زيارة مناسب."
        : "Yes, we welcome showroom visits. Please contact us to schedule a convenient appointment.",
    },
    {
      id: "9",
      category: "payments",
      question: isRTL
        ? "ما هي طرق الدفع المتاحة؟"
        : "What payment methods do you accept?",
      answer: isRTL
        ? "نقبل التحويل البنكي والشيكات وأوامر الشراء للشركات المسجلة. يمكن مناقشة شروط الدفع المحددة مع فريق المبيعات لدينا."
        : "We accept bank transfers, checks, and purchase orders from registered businesses. Specific payment terms can be discussed with our sales team.",
    },
    {
      id: "10",
      category: "solutions",
      question: isRTL
        ? "هل تتعاملون مع مشاريع المشتريات واسعة النطاق؟"
        : "Do you handle large-scale procurement projects?",
      answer: isRTL
        ? "نعم، نتخصص في مشاريع المشتريات واسعة النطاق للشركات والمؤسسات الحكومية. لدينا القدرة على إدارة طلبات الإمداد الكاملة مع التوصيل والتركيب في مواقع متعددة."
        : "Yes, we specialize in large-scale procurement projects for corporations and government institutions. We have the capacity to manage full supply orders with delivery and installation across multiple locations.",
    },
  ]

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-[#f8f9fa] flex flex-col items-start relative w-full"
    >
      {/* FAQ Header Section */}
      <section className="flex flex-col gap-4 items-center px-6 md:px-[60px] py-10 md:py-[40px] w-full">
        <p className="text-[32px] md:text-[clamp(28px,2.5vw,40px)] leading-[1.25] text-[#17284a] font-normal"
           style={{ fontFamily: isRTL ? undefined : "Caveat, cursive" }}>
          {isRTL ? "مركز الدعم" : "Support Center"}
        </p>
        <h1 className="text-[32px] md:text-[48px] leading-[1.25] font-bold text-[#17284a] text-center">
          {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
        </h1>
        <p className="text-[16px] md:text-[20px] leading-[1.4] text-[#5d5d61] text-center max-w-[760px]">
          {isRTL
            ? "اعثر على إجابات حول منتجاتنا وخدماتنا وكيف نعمل معك."
            : "Find answers about our products, services, and how we work with you."}
        </p>
      </section>

      {/* FAQ List Section */}
      <section className="flex flex-col gap-6 md:gap-[24px] items-center px-6 md:px-[60px] py-10 md:py-[80px] w-full">
        <FAQAccordion
          items={faqItems}
          categories={categories}
          isRTL={isRTL}
        />
      </section>

      {/* Still Have Questions CTA */}
      <section className="bg-white flex flex-col items-center justify-center p-6 md:p-[60px] w-full">
        <div className="bg-[#262d3b] flex flex-col gap-8 items-center justify-center px-6 md:px-[40px] py-10 md:py-[50px] rounded-[24px] md:rounded-[40px] w-full max-w-[1392px]">
          <div className="flex flex-col gap-3 items-center text-center text-white">
            <h2 className="text-[28px] md:text-[40px] leading-[1.18] font-medium">
              {isRTL ? "لا تزال لديك أسئلة؟" : "Still Have Questions?"}
            </h2>
            <p className="text-[16px] md:text-[18px] leading-[1.4] text-white/80 max-w-[436px]">
              {isRTL
                ? "فريقنا هنا للمساعدة. تواصل معنا وسنعاود الاتصال بك خلال 24 ساعة."
                : "Our team is here to help. Reach out and we'll get back to you within 24 hours."}
            </p>
          </div>
          <LocalizedClientLink
            href="/contact"
            className="border border-white flex gap-2 items-center justify-center px-6 md:px-9 py-4 md:py-6 rounded-[16px] text-[16px] font-medium text-white hover:bg-white/10 transition-colors w-full sm:w-auto sm:w-[240px]"
          >
            <Phone className="w-5 h-5" />
            <span>{isRTL ? "تواصل مع احد ممثلينا" : "Contact one of our representatives"}</span>
            <ArrowRight className={isRTL ? "w-5 h-5 rotate-180" : "w-5 h-5"} />
          </LocalizedClientLink>
        </div>
      </section>
    </main>
  )
}
