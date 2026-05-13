import { Container } from "@modules/common/components/container";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore CASANEST services for turnkey furniture, IT, and space setup solutions.",
};

type PageProps = {
  params: {
    locale: string;
    countryCode: string;
  };
};

const services = [
  {
    key: "fitout",
    titleEn: "Turnkey Fit-out",
    titleAr: "تجهيز متكامل",
    descEn: "End-to-end planning, design, and execution for your space.",
    descAr: "تخطيط وتصميم وتنفيذ كامل لمساحتك من البداية للنهاية.",
  },
  {
    key: "furniture",
    titleEn: "Furniture Solutions",
    titleAr: "حلول الأثاث",
    descEn: "Curated furniture for offices, homes, hotels, and retail.",
    descAr: "أثاث مختار للمكاتب والمنازل والفنادق والمتاجر.",
  },
  {
    key: "it",
    titleEn: "IT & Networking",
    titleAr: "التقنية والشبكات",
    descEn: "Devices, cabling, and networking for reliable operations.",
    descAr: "أجهزة وبنية تحتية وشبكات لعمليات مستقرة.",
  },
  {
    key: "security",
    titleEn: "Security Systems",
    titleAr: "أنظمة أمنية",
    descEn: "CCTV, access control, and smart monitoring setups.",
    descAr: "كاميرات، تحكم في الدخول، ومراقبة ذكية.",
  },
  {
    key: "lighting",
    titleEn: "Lighting & Electrical",
    titleAr: "الإضاءة والكهرباء",
    descEn: "Efficient lighting and electrical appliances integration.",
    descAr: "حلول إضاءة فعالة ودمج الأجهزة الكهربائية.",
  },
  {
    key: "maintenance",
    titleEn: "Maintenance & Support",
    titleAr: "الصيانة والدعم",
    descEn: "Ongoing support to keep everything running smoothly.",
    descAr: "دعم مستمر للحفاظ على أفضل أداء.",
  },
];

const steps = [
  {
    key: "discover",
    titleEn: "Discover",
    titleAr: "استكشاف",
    descEn: "We understand your needs, space, and timeline.",
    descAr: "نفهم احتياجاتك ومساحتك والجدول الزمني.",
  },
  {
    key: "design",
    titleEn: "Design",
    titleAr: "تصميم",
    descEn: "We propose layouts, furniture, and tech stacks.",
    descAr: "نقترح التخطيطات والأثاث والحلول التقنية.",
  },
  {
    key: "deliver",
    titleEn: "Deliver",
    titleAr: "تنفيذ",
    descEn: "We deliver, install, and hand over the space.",
    descAr: "نقوم بالتوريد والتركيب والتسليم النهائي.",
  },
];

export default async function OurServicesPage({ params }: PageProps) {
  const t = await getTranslations("not-found");

  const locale = await getLocale(); // "ar", "en", ...

  const isRTL = locale === "ar";
  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="bg-white">
      <section className="bg-gradient-to-br from-[#043364] to-[#022a55] text-white">
        <Container className="!py-14 small:!py-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-white/70">
              {isRTL ? "خدماتنا" : "Our Services"}
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
              {isRTL
                ? "حلول متكاملة لتجهيز المساحات"
                : "Complete solutions to equip your spaces"}
            </h1>
            <p className="mt-4 text-white/80 text-base sm:text-lg">
              {isRTL
                ? "من التصميم والتوريد إلى التركيب والدعم، نوفر كل ما تحتاجه لمساحتك في مكان واحد."
                : "From design and sourcing to installation and support, we deliver everything your space needs in one place."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LocalizedClientLink
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-[#043364] font-semibold hover:bg-white/90 transition"
              >
                {isRTL ? "تواصل معنا" : "Contact Us"}
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-5 py-2 text-white hover:border-white transition"
              >
                {isRTL ? "تصفح المنتجات" : "Browse Store"}
              </LocalizedClientLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="!py-12 small:!py-14">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.key}
                className="rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-[#043364]">
                  {isRTL ? service.titleAr : service.titleEn}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {isRTL ? service.descAr : service.descEn}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gray-50">
        <Container className="!py-12 small:!py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#043364]">
                {isRTL ? "كيف نعمل" : "How We Work"}
              </h2>
              <p className="mt-3 text-gray-600">
                {isRTL
                  ? "نضمن تجربة سلسة من الفكرة إلى التسليم، بخطوات واضحة وشفافة."
                  : "We deliver a smooth journey from idea to handover with clear, transparent steps."}
              </p>
            </div>
            <div className="grid gap-4">
              {steps.map((step, index) => (
                <div key={step.key} className="flex gap-4 rounded-xl bg-white p-4 border border-gray-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#043364]/10 text-[#043364] font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#043364]">
                      {isRTL ? step.titleAr : step.titleEn}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isRTL ? step.descAr : step.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="!py-12 small:!py-14">
          <div className="rounded-3xl border border-[#043364]/20 bg-gradient-to-br from-[#043364]/5 to-white p-8 sm:p-10 flex flex-col gap-4 items-start">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#043364]">
              {isRTL ? "جاهز لبدء مشروعك؟" : "Ready to start your project?"}
            </h2>
            <p className="text-gray-600 max-w-2xl">
              {isRTL
                ? "شاركنا تفاصيل مشروعك وسنقترح أفضل الحلول المناسبة لميزانيتك وموعدك."
                : "Share your project details and we will recommend the best solution for your budget and timeline."}
            </p>
            <LocalizedClientLink
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#043364] px-6 py-3 text-white font-semibold hover:bg-[#022a55] transition"
            >
              {isRTL ? "احصل على استشارة" : "Get a Consultation"}
            </LocalizedClientLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
