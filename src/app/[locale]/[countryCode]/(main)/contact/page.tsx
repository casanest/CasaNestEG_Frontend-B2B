import { listSocialMedia } from "@lib/data/social-media";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
} from "lucide-react";
import ContactForm from "@modules/contact/components/contact-form";
import { getPlatformLabel } from "@modules/common/components/social-media-links";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with CASANEST for tailored solutions and support.",
};

type PageProps = {
  params: {
    locale: string;
    countryCode: string;
  };
};

type PlatformVisual = {
  logo: string;
  logoWidth?: string;
  gradient: string;
};

const platformVisuals: Record<string, PlatformVisual> = {
  linkedin: {
    logo: "/contact/linkedin-logo.svg",
    gradient: "from-[#ebf0ff]",
  },
  instagram: {
    logo: "/contact/instagram-logo.svg",
    gradient: "from-[#fff0eb]",
  },
  twitter: {
    logo: "/contact/x-logo.svg",
    logoWidth: "w-[128px]",
    gradient: "from-[#f0f2f5]",
  },
  facebook: {
    logo: "/contact/facebook-logo.svg",
    gradient: "from-[#e8ecff]",
  },
  youtube: {
    logo: "/contact/youtube-logo.svg",
    gradient: "from-[#fff0eb]",
  },
  tiktok: {
    logo: "/contact/tiktok-logo.svg",
    gradient: "from-[#f0f2f5]",
  },
  whatsapp: {
    logo: "/contact/whatsapp-logo.svg",
    gradient: "from-[#ebf0ff]",
  },
};

const defaultVisual: PlatformVisual = {
  logo: "/contact/facebook-logo.svg",
  gradient: "from-[#e8ecff]",
};

export default async function ContactPage({ params }: PageProps) {
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const socialMediaLinks = await listSocialMedia();

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="bg-[#f8f9fa] font-satoshi">
      {/* Form Columns Wrap */}
      <section className="w-full">
        <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[60px] items-start px-[16px] lg:px-[60px] py-[44px] lg:py-[80px] max-w-[1512px] mx-auto">
            {/* Left Column - Info */}
            <div className="flex-1 flex flex-col justify-between gap-[24px] lg:gap-[40px] py-0 lg:py-[40px] w-full lg:order-2">
              {/* Heading Block */}
              <div className="flex flex-col gap-[8px] lg:gap-[16px]">
                <p
                  className="text-[32px] lg:text-[clamp(28px,2.5vw,40px)] leading-[1.2] text-[#17284a]"
                  style={{ fontFamily: "var(--font-caveat), cursive" }}
                >
                  {isRTL ? "تواصل معنا" : "Get in Touch"}
                </p>
                <h1 className="text-[24px] lg:text-[40px] font-bold leading-[1.3] lg:leading-[1.18] text-[#17284a]">
                  {isRTL
                    ? "تواصل مع فريقنا"
                    : "Get in Touch With Our Team"}
                </h1>
                <p className="text-[16px] lg:text-[18px] leading-[1.5] text-[#5d5d61] lg:max-w-[549px]">
                  {isRTL
                    ? "سواء كان لديك سؤال حول منتجاتنا، أو تحتاج مساعدة في حزمة حلول، أو ترغب في مناقشة مشروع مشتريات كبير، يسعدنا أن نسمع منك."
                    : "Whether you have a question about our products, need help with a Solution Package, or want to discuss a large procurement project, we'd love to hear from you."}
                </p>
              </div>

              {/* Contact Cards */}
              <div className="flex flex-col gap-[12px] lg:gap-[20px] w-full">
                {/* Row 1 - Phone & Email side by side */}
                <div className="flex gap-[12px] lg:gap-[20px]">
                  {/* Phone Card */}
                  <a
                    href="tel:01233365362"
                    className="flex-1 bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] flex flex-col gap-[8px] lg:gap-[12px] hover:shadow-lg transition"
                  >
                    <div className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#f3f4f6] flex items-center justify-center">
                      <Phone size={20} className="text-[#17284a]" />
                    </div>
                    <p className="text-[14px] font-bold lg:font-medium text-[#5d5d61]">
                      {isRTL ? "اتصل بنا" : "Call Us"}
                    </p>
                    <p className="text-[14px] lg:text-[16px] font-bold text-[#17284a]">
                      01233365362
                    </p>
                  </a>
                  {/* Email Card */}
                  <div className="flex-1 bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] flex flex-col gap-[8px] lg:gap-[12px]">
                    <div className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#f3f4f6] flex items-center justify-center">
                      <Mail size={20} className="text-[#17284a]" />
                    </div>
                    <p className="text-[14px] font-bold lg:font-medium text-[#5d5d61]">
                      {isRTL ? "راسلنا" : "Email Us"}
                    </p>
                    <p className="text-[14px] lg:text-[16px] font-bold text-[#17284a] truncate">
                      info@casanest.com
                    </p>
                  </div>
                </div>
                {/* Row 1.5 - WhatsApp (full width, clickable) */}
                <a
                  href="https://wa.me/201233365362"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] w-full flex flex-row lg:flex-col gap-[16px] items-center lg:items-start hover:shadow-lg transition"
                >
                  <div className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      fill="#17284a"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-[2px] lg:gap-[4px]">
                    <p className="text-[14px] font-medium text-[#5d5d61]">
                      {isRTL ? "واتساب" : "WhatsApp"}
                    </p>
                    <p className="text-[14px] lg:text-[16px] font-bold text-[#17284a]">
                      01233365362
                    </p>
                  </div>
                </a>
                {/* Row 2 - Hours (full width, horizontal on mobile) */}
                <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] w-full lg:flex-1 flex flex-row lg:flex-col gap-[16px] items-center lg:items-start">
                  <div className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-[#17284a]" />
                  </div>
                  <div className="flex flex-col gap-[2px] lg:gap-[4px]">
                    <p className="text-[14px] font-medium text-[#5d5d61]">
                      {isRTL ? "ساعات العمل" : "Office Hours"}
                    </p>
                    <p className="text-[14px] lg:text-[16px] font-bold text-[#17284a]">
                      {isRTL
                        ? "الأحد – الخميس: 9:00 ص – 6:00 م"
                        : "Sun – Thu: 9:00 AM – 6:00 PM"}
                    </p>
                  </div>
                </div>
                {/* Row 3 - Location (full width, horizontal on mobile) */}
                <a
                  href="https://www.google.com/maps/search/%D8%B4%D8%A7%D8%B1%D8%B9+%D8%A7%D8%AD%D9%85%D8%AF+%D8%B4%D9%88%D9%82%D9%8A+%D8%A7%D9%85%D8%AA%D8%AF%D8%A7%D8%AF+%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D9%81%D8%B8+%E2%80%93+%D8%A7%D8%A8%D8%B1%D8%A7%D8%AC+%D8%B1%D9%88%D9%8A%D8%A7%D9%84+%D8%B3%D9%8A%D8%AA%D9%8A+%D8%A7%D9%84%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%AA%D8%A7%D9%86%D9%8A+%D8%A7%D9%84%D8%AF%D9%88%D8%B1+%D8%A7%D9%84%D9%88%D9%84++%E2%80%93+%D8%A7%D8%B9%D9%84%D9%8A+%D8%B1%D9%86%D9%8A%D9%86+%E2%80%93+%D8%A7%D9%84%D9%81%D9%8A%D9%88%D9%85%E2%80%AD/@29.3226553,30.8439463,723m/data=!3m2!1e3!4b1?entry=tts&g_ep=EgoyMDI2MDgzMS4wIPu8ASoASAFQAw%3D%3D&skid=e460d804-0ff0-4b41-89a0-d690d5d90716"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] w-full lg:flex-1 flex flex-row lg:flex-col gap-[16px] items-center lg:items-start hover:shadow-lg transition"
                >
                  <div className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-[#17284a]" />
                  </div>
                  <div className="flex flex-col gap-[2px] lg:gap-[4px]">
                    <p className="text-[14px] font-medium text-[#5d5d61]">
                      {isRTL ? "الموقع" : "Location"}
                    </p>
                    <p className="text-[14px] lg:text-[16px] font-bold text-[#17284a]">
                      {isRTL
                        ? "شارع احمد شوقي امتداد المحافظ – ابراج رويال سيتي – اعلي رنين – الفيوم"
                        : "Ahmed Shawki st. Royal City towers, above Ranin, second tower, first upper floor"}
                    </p>
                  </div>
                </a>
                                <a
                  href="https://www.google.com/maps/place/30%C2%B003'34.8%22N+31%C2%B011'43.9%22E/@30.0596581,31.1929455,17z/data=!3m1!4b1!4m4!3m3!8m2!3d30.0596581!4d31.1955204?hl=en&entry=ttu&g_ep=EgoyMDI2MDkwMS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] w-full lg:flex-1 flex flex-row lg:flex-col gap-[16px] items-center lg:items-start hover:shadow-lg transition"
                >
                  <div className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-[#17284a]" />
                  </div>
                  <div className="flex flex-col gap-[2px] lg:gap-[4px]">
                    <p className="text-[14px] font-medium text-[#5d5d61]">
                      {isRTL ? "الموقع" : "Location"}
                    </p>
                    <p className="text-[14px] lg:text-[16px] font-bold text-[#17284a]">
                      {isRTL
                        ? "عماره 5 – شارع البرج – الدور الخامس – ميدان لبنان – المهندسين"
                        : "Building 5 – Al Burj Street – Fifth Floor – Lebanon Square – Mohandessin"}
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column - Form Card */}
            <div className="flex-1 lg:order-1 w-full">
              <ContactForm isRTL={isRTL} />
            </div>
          </div>
      </section>

      {/* Social Media Section */}
      {socialMediaLinks.length > 0 && (
      <section className="bg-[#f8f9fa] w-full">
        <div className="flex flex-col gap-[28px] lg:gap-[40px] px-[16px] lg:px-[60px] py-[44px] lg:py-[80px] max-w-[1512px] mx-auto">
          {/* Heading */}
          <div className="flex flex-col gap-[8px] lg:gap-[12px] items-center text-center">
            <p
              className="text-[32px] lg:text-[clamp(28px,2.5vw,40px)] leading-[1.2] text-[#17284a]"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              {isRTL ? "وسائل التواصل" : "Social Media"}
            </p>
            <h2 className="text-[24px] lg:text-[32px] font-bold leading-[1.3] lg:leading-[1.2] text-[#17284a]">
              {isRTL ? "تواصل معنا" : "Connect With Us"}
            </h2>
            <p className="text-[16px] lg:text-[18px] leading-[1.5] text-[#5d5d61] max-w-[900px]">
              {isRTL
                ? "تابع كازانيست عبر قنواتنا الاجتماعية لأحدث المشاريع والمنتجات والرؤى الصناعية."
                : "Follow Casanest across our social channels for the latest projects, products, and industry insights."}
            </p>
          </div>

          {/* Social Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
            {socialMediaLinks.map((link) => {
              const visual = platformVisuals[link.platform] || defaultVisual;
              const title = link.label || getPlatformLabel(link.platform);
              const handle = link.description || "@casanesteg";
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gradient-to-r ${visual.gradient} to-white border border-[#e5e7eb] rounded-2xl shadow-sm flex flex-row items-center justify-between px-6 py-8 lg:px-[1vw] lg:py-[2vw] hover:shadow-md transition w-full`}
                >
                  {/* Left: Icon + Title/Handle */}
                  <div className="flex flex-row items-center gap-4 min-w-0">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center shrink-0">
                      <img
                        src={visual.logo}
                        alt={link.platform}
                        className="max-w-full max-h-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-[22px] lg:text-[28px] font-bold leading-tight text-[#17284a]">
                        {title}
                      </p>
                      <p className="text-[16px] lg:text-[20px] font-medium leading-tight text-[#707176] truncate">
                        {handle}
                      </p>
                    </div>
                  </div>
                  {/* Right: CTA Pill */}
                  <div className="flex items-center gap-2 rounded-full bg-[#043364] px-5 py-4 lg:px-[0.8vw] lg:py-[0.8vw] shrink-0">
                    <span className="text-[15px] lg:text-[20px] font-medium text-white whitespace-nowrap">
                      {isRTL ? "تابعنا" : "Follow"}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Map Section */}
      <section className="w-full">
        <div className="flex flex-col gap-6 lg:gap-8 px-4 md:px-8 py-[44px] lg:py-[80px] w-full max-w-[86rem] mx-auto">
          {/* Text Block */}
          <div className="flex flex-col gap-[8px] items-center text-center">
            <p
              className="text-[32px] lg:text-[clamp(28px,2.5vw,40px)] leading-[1.2] text-[#17284a]"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              {isRTL ? "مكاتبنا" : "Our Offices"}
            </p>
            <h2 className="text-[24px] font-bold leading-[1.3] text-[#17284a]">
              {isRTL ? "زر مكاتبنا" : "Visit Our Offices"}
            </h2>
          </div>
          {/* Office Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
            {/* Office 1 - Faiyum */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 lg:p-6 flex items-start gap-[14px]">
                <div className="w-[48px] h-[48px] rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-[#17284a]" />
                </div>
                <div className={`flex flex-col gap-[4px] ${isRTL ? "text-right" : ""}`}>
                  <p className="text-[18px] font-medium text-[#5d5d61]">
                    {isRTL ? "فرع الفيوم" : "Faiyum Branch"}
                  </p>
                  <p className="text-[18px] lg:text-[22px] font-bold text-[#17284a]">
                    {isRTL
                      ? "شارع احمد شوقي امتداد المحافظ – ابراج رويال سيتي – اعلي رنين – الفيوم"
                      : "Ahmed Shawki st. Royal City towers, above Ranin, second tower, first upper floor"}
                  </p>
                </div>
              </div>
              <hr className="border-slate-200 my-0" />
              <a
                href="https://www.google.com/maps/search/%D8%B4%D8%A7%D8%B1%D8%B9+%D8%A7%D8%AD%D9%85%D8%AF+%D8%B4%D9%88%D9%82%D9%8A+%D8%A7%D9%85%D8%AA%D8%AF%D8%A7%D8%AF+%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D9%81%D8%B8+%E2%80%93+%D8%A7%D8%A8%D8%B1%D8%A7%D8%AC+%D8%B1%D9%88%D9%8A%D8%A7%D9%84+%D8%B3%D9%8A%D8%AA%D9%8A+%D8%A7%D9%84%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%AA%D8%A7%D9%86%D9%8A+%D8%A7%D9%84%D8%AF%D9%88%D8%B1+%D8%A7%D9%84%D9%88%D9%84++%E2%80%93+%D8%A7%D8%B9%D9%84%D9%8A+%D8%B1%D9%86%D9%8A%D9%86+%E2%80%93+%D8%A7%D9%84%D9%81%D9%8A%D9%88%D9%85%E2%80%AD/@29.3226553,30.8439463,723m/data=!3m2!1e3!4b1?entry=tts&g_ep=EgoyMDI2MDgzMS4wIPu8ASoASAFQAw%3D%3D&skid=e460d804-0ff0-4b41-89a0-d690d5d90716"
                target="_blank"
                rel="noopener noreferrer"
                className="relative bg-[#e5e7eb] overflow-hidden h-[320px] w-full block hover:shadow-lg transition"
              >
                <iframe
                  src="https://maps.google.com/maps?q=29.3226553,30.8439463&z=15&output=embed"
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                  loading="lazy"
                  title="Faiyum office map"
                />
              </a>
            </div>
            {/* Office 2 - Mohandessin */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 lg:p-6 flex items-start gap-[14px]">
                <div className="w-[48px] h-[48px] rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-[#17284a]" />
                </div>
                <div className={`flex flex-col gap-[4px] ${isRTL ? "text-right" : ""}`}>
                  <p className="text-[18px] font-medium text-[#5d5d61]">
                    {isRTL ? "فرع المهندسين" : "Mohandessin Branch"}
                  </p>
                  <p className="text-[18px] lg:text-[22px] font-bold text-[#17284a]">
                    {isRTL
                      ? "عماره 5 – شارع البرج – الدور الخامس – ميدان لبنان – المهندسين"
                      : "Building 5 – Al Burj Street – Fifth Floor – Lebanon Square – Mohandessin"}
                  </p>
                </div>
              </div>
              <hr className="border-slate-200 my-0" />
              <a
                href="https://www.google.com/maps/place/30%C2%B003'34.8%22N+31%C2%B011'43.9%22E/@30.0596581,31.1929455,17z/data=!3m1!4b1!4m4!3m3!8m2!3d30.0596581!4d31.1955204?hl=en&entry=ttu&g_ep=EgoyMDI2MDkwMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="relative bg-[#e5e7eb] overflow-hidden h-[320px] w-full block hover:shadow-lg transition"
              >
                <iframe
                  src="https://maps.google.com/maps?q=30.0596581,31.1955204&z=15&output=embed"
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                  loading="lazy"
                  title="Mohandessin office map"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
