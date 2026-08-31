import { listSocialMedia } from "@lib/data/social-media";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  ChevronDown,
  UploadCloud,
} from "lucide-react";

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

const subjectOptions = [
  "General Inquiry",
  "Product Question",
  "Solution Package",
  "Procurement Project",
  "Partnership",
  "Support",
];

type PlatformVisual = {
  logo: string;
  logoWidth?: string;
  gradient: string;
  cta: string;
};

const platformVisuals: Record<string, PlatformVisual> = {
  linkedin: {
    logo: "/contact/linkedin-logo.svg",
    gradient: "from-[#ebf0ff]",
    cta: "Connect on LinkedIn",
  },
  instagram: {
    logo: "/contact/instagram-logo.svg",
    gradient: "from-[#fff0eb]",
    cta: "Follow on Instagram",
  },
  twitter: {
    logo: "/contact/x-logo.svg",
    logoWidth: "w-[128px]",
    gradient: "from-[#f0f2f5]",
    cta: "Follow on X",
  },
  facebook: {
    logo: "/contact/facebook-logo.svg",
    gradient: "from-[#e8ecff]",
    cta: "Follow on Facebook",
  },
  youtube: {
    logo: "/contact/youtube-logo.svg",
    gradient: "from-[#fff0eb]",
    cta: "Subscribe on YouTube",
  },
  tiktok: {
    logo: "/contact/tiktok-logo.svg",
    gradient: "from-[#f0f2f5]",
    cta: "Follow on TikTok",
  },
  whatsapp: {
    logo: "/contact/whatsapp-logo.svg",
    gradient: "from-[#ebf0ff]",
    cta: "Chat on WhatsApp",
  },
};

const defaultVisual: PlatformVisual = {
  logo: "/contact/facebook-logo.svg",
  gradient: "from-[#e8ecff]",
  cta: "Follow Us",
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
            <div className="flex-1 flex flex-col justify-between gap-[24px] lg:gap-[40px] py-0 lg:py-[40px] w-full lg:max-w-[604px]">
              {/* Heading Block */}
              <div className="flex flex-col gap-[8px] lg:gap-[16px]">
                <p
                  className="text-[24px] leading-[1.2] text-[#17284a]"
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
                  <div className="flex-1 bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] flex flex-col gap-[8px] lg:gap-[12px]">
                    <div className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#f3f4f6] flex items-center justify-center">
                      <Phone size={20} className="text-[#17284a]" />
                    </div>
                    <p className="text-[14px] font-bold lg:font-medium text-[#5d5d61]">
                      {isRTL ? "اتصل بنا" : "Call Us"}
                    </p>
                    <p className="text-[14px] lg:text-[16px] font-bold text-[#17284a]">
                      +20 2 1234 5678
                    </p>
                  </div>
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
                        ? "الأحد – الخميس: ٩:٠٠ ص – ٦:٠٠ م"
                        : "Sun – Thu: 9:00 AM – 6:00 PM"}
                    </p>
                  </div>
                </div>
                {/* Row 3 - Location (full width, horizontal on mobile) */}
                <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] lg:p-[20px] w-full lg:flex-1 flex flex-row lg:flex-col gap-[16px] items-center lg:items-start">
                  <div className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-[#17284a]" />
                  </div>
                  <div className="flex flex-col gap-[2px] lg:gap-[4px]">
                    <p className="text-[14px] font-medium text-[#5d5d61]">
                      {isRTL ? "الموقع" : "Location"}
                    </p>
                    <p className="text-[14px] lg:text-[16px] font-bold text-[#17284a]">
                      {isRTL
                        ? "شارع أحمد شوكي، أبراج المدينة الملكية، فوق رنين، البرج الثاني، الطابق الأول العلوي"
                        : "Ahmed Shawki st. Royal City towers, above Ranin, second tower, first upper floor"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Card */}
            <div className="bg-white border border-[#e5e7eb] rounded-[16px] p-[20px] lg:p-[24px] w-full lg:max-w-[728px] flex flex-col gap-[20px] lg:gap-[28px]">
              <form
                className="flex flex-col gap-[16px] lg:gap-[20px]"
                action="mailto:info@casanest.com"
                method="post"
                encType="text/plain"
              >
                {/* Row 1 - Names */}
                <div className="flex gap-[16px] flex-col lg:flex-row">
                  <div className="flex-1 flex flex-col gap-[6px] lg:gap-[8px]">
                    <label className="text-[14px] font-medium text-[#17284a]">
                      {isRTL ? "الاسم الكامل" : "Full Name"}
                    </label>
                    <input
                      name="name"
                      required
                      className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
                      placeholder={isRTL ? "مثال: علي" : "e.g. Aly"}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-[6px] lg:gap-[8px]">
                    <label className="text-[14px] font-medium text-[#17284a]">
                      {isRTL ? "الموقع" : "Location"}
                    </label>
                    <input
                      name="location"
                      className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
                      placeholder={isRTL ? "مثال: المنصورة" : "e.g. Mansoura"}
                    />
                  </div>
                </div>

                {/* Row 2 - Contacts */}
                <div className="flex gap-[16px] flex-col lg:flex-row">
                  <div className="flex-1 flex flex-col gap-[6px] lg:gap-[8px]">
                    <label className="text-[14px] font-medium text-[#17284a]">
                      {isRTL ? "البريد الإلكتروني" : "Email Address"}
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
                      placeholder={isRTL ? "مثال: علي@شركة.com" : "e.g. aly@company.com"}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-[6px] lg:gap-[8px]">
                    <label className="text-[14px] font-medium text-[#17284a]">
                      {isRTL ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <input
                      name="phone"
                      className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
                      placeholder={isRTL ? "مثال: +20 100 123 4567" : "e.g. +20 100 123 4567"}
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div className="flex flex-col gap-[6px] lg:gap-[8px]">
                  <label className="text-[14px] font-medium text-[#17284a]">
                    {isRTL ? "اسم الشركة" : "Company Name"}
                  </label>
                  <input
                    name="company"
                    className="h-[44px] lg:h-[52px] bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20"
                    placeholder={
                      isRTL
                        ? "مثال: شركاء تطوير القاهرة"
                        : "e.g. Cairo Development Partners"
                    }
                  />
                </div>

                {/* Subject Dropdown */}
                <div className="flex flex-col gap-[6px] lg:gap-[8px]">
                  <label className="text-[14px] font-medium text-[#17284a]">
                    {isRTL ? "الموضوع" : "Subject"}
                  </label>
                  <div className="relative">
                    <select
                      name="subject"
                      className="h-[44px] lg:h-[52px] w-full bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] appearance-none focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {isRTL ? "اختر موضوعاً" : "Select a topic"}
                      </option>
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute right-[14px] lg:right-[16px] top-1/2 -translate-y-1/2 text-[#17284a] pointer-events-none"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-[6px] lg:gap-[8px]">
                  <label className="text-[14px] font-medium text-[#17284a]">
                    {isRTL ? "الرسالة" : "Message"}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="bg-[#f3f4f6] rounded-[8px] px-[14px] lg:px-[16px] py-[12px] lg:py-[14px] text-[16px] text-[#17284a] placeholder:text-[#5d5d61] focus:outline-none focus:ring-2 focus:ring-[#17284a]/20 resize-none"
                    placeholder={
                      isRTL
                        ? "أخبرنا عن متطلبات مشروعك، الكميات، والجدول الزمني..."
                        : "Tell us about your project requirements, quantities, and timelines..."
                    }
                  />
                </div>

                {/* Upload Section - hidden on mobile */}
                <div className="hidden lg:flex flex-col gap-[12px]">
                  <label className="text-[14px] font-medium text-[#17284a]">
                    {isRTL ? "المرفقات (اختياري)" : "Attachments (Optional)"}
                  </label>
                  <div className="bg-[#f9fafb] border border-dashed border-[#e5e7eb] rounded-[12px] flex flex-col gap-[12px] items-center justify-center py-[32px] cursor-pointer hover:border-[#17284a]/30 transition">
                    <UploadCloud size={32} className="text-[#17284a]" />
                    <div className="flex flex-col gap-[4px] items-center">
                      <p className="text-[16px] text-[#17284a]">
                        {isRTL
                          ? "اسحب وأفلت الملفات هنا أو"
                          : "Drag & drop files here or"}
                      </p>
                      <p className="text-[14px] font-medium text-[#17284a] underline">
                        {isRTL ? "تصفح الملفات" : "Browse Files"}
                      </p>
                    </div>
                  </div>
                  <p className="text-[14px] text-[#6b7280]">
                    {isRTL
                      ? "الصيغ المقبولة: PDF, DOC, DOCX, XLS, XLSX, DWG — الحد الأقصى 10 ميجابايت لكل ملف"
                      : "Accepted formats: PDF, DOC, DOCX, XLS, XLSX, DWG — Max 10MB per file"}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-[#17284a] text-white text-[16px] font-medium rounded-[16px] lg:rounded-[12px] py-[24px] px-[36px] hover:bg-[#0f1d38] transition"
                >
                  {isRTL ? "إرسال الاستفسار ←" : "Submit Enquiry →"}
                </button>
              </form>
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
              className="text-[24px] leading-[1.2] text-[#17284a]"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              {isRTL ? "وسائل التواصل" : "Social Media"}
            </p>
            <h2 className="text-[24px] lg:text-[32px] font-bold leading-[1.3] lg:leading-[1.2] text-[#17284a]">
              {isRTL ? "تواصل معنا" : "Connect With Us"}
            </h2>
            <p className="text-[16px] lg:text-[18px] leading-[1.5] text-[#5d5d61] max-w-[900px]">
              {isRTL
                ? "تابع كاسانيست عبر قنواتنا الاجتماعية لأحدث المشاريع والمنتجات والرؤى الصناعية."
                : "Follow Casanest across our social channels for the latest projects, products, and industry insights."}
            </p>
          </div>

          {/* Social Cards */}
          <div className="grid grid-cols-2 lg:flex gap-[16px]">
            {socialMediaLinks.map((link) => {
              const visual = platformVisuals[link.platform] || defaultVisual;
              const title = link.label || link.platform;
              const desc = link.description || "";
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gradient-to-r ${visual.gradient} to-white border border-[#e5e7eb] rounded-[16px] lg:rounded-[20px] flex flex-col items-center justify-between p-[16px] lg:px-[20px] lg:py-[24px] overflow-hidden hover:shadow-lg transition h-[233px] lg:h-[392px]`}
                >
                  <div className="flex flex-col gap-[12px] items-center w-full">
                    <div className="w-[60px] h-[60px] lg:w-[64px] lg:h-[64px] flex items-center justify-center">
                      <img
                        src={visual.logo}
                        alt={link.platform}
                        className="max-w-full max-h-full"
                      />
                    </div>
                    <div className="flex flex-col gap-[4px] items-center text-center">
                      <p className="text-[16px] lg:text-[32px] font-bold leading-[1.5] lg:leading-[1.2] text-[#17284a]">
                        {title}
                      </p>
                      <p className="text-[11px] lg:text-[16px] font-medium leading-[14px] lg:leading-[1.5] text-[#707176]">
                        {desc}
                      </p>
                    </div>
                  </div>
                  <div className="border border-black rounded-[16px] px-[36px] py-[8px] lg:py-[16px] w-full h-[44px] lg:h-auto flex items-center justify-center gap-[8px] hover:bg-black hover:text-white transition">
                    <span className="w-[6px] h-[6px] rounded-full bg-current shrink-0 lg:hidden"></span>
                    <span className="text-[12px] lg:text-[16px] font-medium">{visual.cta}</span>
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
        <div className="flex flex-col gap-[24px] lg:gap-[32px] px-[16px] lg:px-[60px] py-[44px] lg:py-[80px] max-w-[1512px] mx-auto">
          {/* Text Block */}
          <div className="flex flex-col gap-[8px]">
            <p
              className="text-[24px] leading-[1.2] text-[#17284a]"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              {isRTL ? "مكتبنا" : "Our Office"}
            </p>
            <h2 className="text-[24px] font-bold leading-[1.3] text-[#17284a]">
              {isRTL ? "زر مكتبنا" : "Visit Our Office"}
            </h2>
            <p className="text-[16px] leading-[1.5] text-[#5d5d61]">
              {isRTL
                ? "مقر كاسانيست، القاهرة بزنس بارك، القاهرة الجديدة، مصر"
                : "Casanest Headquarters, Cairo Business Park, New Cairo, Egypt"}
            </p>
          </div>
          {/* Map Container */}
          <div className="relative bg-[#e5e7eb] rounded-[16px] overflow-hidden h-[280px] lg:h-[429px] w-full">
            <img
              src="/contact/map.png"
              alt="Office location map"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[76px] h-[76px] lg:w-[102px] lg:h-[102px]">
              <img
                src="/contact/map-pin-bubble.svg"
                alt="Map pin"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
