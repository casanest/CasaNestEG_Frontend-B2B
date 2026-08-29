
import { cn } from "@lib/util/cn";
import { formatNameForTestId } from "@lib/util/formatNameForTestId";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { LinkedinIcon } from "@modules/common/icons/linkedin";
import { FacebookIcon } from "@modules/common/icons/facebook";
import { XLogoIcon } from "@modules/common/icons/twitter";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

type Category = {
  id: string;
  name_en: string;
  name_ar: string;
  handle: string;
  image_url: string | null;
};

interface ApiCollection {
  id: string;
  name_en: string;
  name_ar: string;
  handle_en: string;
  handle_ar: string;
}

type ProductCategory = {
  id: string;
  name_en: string;
  name_ar: string;
  handle_en: string;
  handle_ar: string;
  image_url: string | null;
  parent_category_id: string | null;
  category_children: ProductCategory[];
};

function SocialMedia({ className }: { className?: string }) {
  const socials = [
    { href: "#", icon: <LinkedinIcon />, label: "LinkedIn", testId: "linkedin-link" },
    { href: "#", icon: <FacebookIcon />, label: "Facebook", testId: "facebook-link" },
    { href: "#", icon: <XLogoIcon />, label: "X (Twitter)", testId: "x-link" },
  ];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {socials.map(({ href, icon, label, testId }) => (
        <LocalizedClientLink
          key={testId}
          href={href}
          data-testid={testId}
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition"
        >
          {icon}
        </LocalizedClientLink>
      ))}
    </div>
  );
}

interface FooterProps {
  productCategories: ProductCategory[];
  collections: ApiCollection[];
  locale: string;
}

export default function Footer({ productCategories, collections, locale }: FooterProps) {
  const isRTL = locale === "ar";

  const casanestLinks = [
    { href: "/", label: isRTL ? "الرئيسية" : "Homepage" },
    { href: "/our-services", label: isRTL ? "المشاريع" : "Projects" },
    { href: "/store", label: isRTL ? "الحلول المنتقاة" : "Curated Solutions" },
    { href: "/about-us", label: isRTL ? "من نحن" : "About Us" },
  ];

  const supportLinks = [
    { href: "/contact", label: isRTL ? "تواصل معنا" : "Contact Us" },
    { href: "/faq", label: isRTL ? "الأسئلة الشائعة" : "FAQs" },
  ];

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-[#051026] text-white"
    >
      {/* Main Footer Content */}
      <div className="content-container mx-auto px-[16px] py-[44px] lg:px-[60px] lg:py-[60px]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-[40px] lg:gap-0">
          {/* Company Info Column */}
          <div className="flex flex-col gap-4 max-w-[379px] lg:w-[379px]">
            <LocalizedClientLink
              href="/"
              className="inline-block"
              data-testid="nav-store-link"
              aria-label="Homepage"
            >
              <Image
                src="/casanest.png"
                alt="CASANEST Logo"
                width={172}
                height={56}
                priority
                className="w-[120px] h-auto md:w-[172px] object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </LocalizedClientLink>

            <p className="font-satoshi text-[20px] leading-[1.4] text-white/70">
              {isRTL
                ? "حلول متكاملة للأثاث والتقنية والمساحات الاحترافية."
                : "Integrated solutions for furniture, technology, and professional spaces."}
            </p>

            <SocialMedia />
          </div>

          {/* Links Columns */}
          <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[16px] flex-1 max-w-[860px]">
            {/* Casanest Column */}
            <div className="flex flex-col gap-4 flex-1">
              <h3 className="font-satoshi text-[18px] font-medium">
                {isRTL ? "كازانست" : "Casanest"}
              </h3>
              <ul className="flex flex-col gap-4 text-[16px] text-white/80 font-satoshi">
                {casanestLinks.map((link, index) => (
                  <li key={index}>
                    <LocalizedClientLink
                      href={link.href}
                      className="hover:text-white transition"
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products Column */}
            {productCategories.length > 0 && (
              <div className="flex flex-col gap-4 flex-1">
                <h3 className="font-satoshi text-[18px] font-medium">
                {isRTL ? "المنتجات" : "Products"}
              </h3>
              <ul className="flex flex-col gap-4 text-[16px] text-white/80 font-satoshi" data-testid="footer-categories">
                  {productCategories.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/categories/${isRTL ? c.handle_ar ?? c.handle_en : c.handle_en ?? c.handle_ar}`}
                        className="hover:text-white transition whitespace-nowrap"
                        data-testid={formatNameForTestId(`${c.name_en}-link`)}
                      >
                        {isRTL ? c.name_ar : c.name_en}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Support Column */}
            <div className="flex flex-col gap-4 flex-1">
              <h3 className="font-satoshi text-[18px] font-medium">
                {isRTL ? "الدعم" : "Support"}
              </h3>
              <ul className="flex flex-col gap-4 text-[16px] text-white/80 font-satoshi">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <LocalizedClientLink
                      href={link.href}
                      className="hover:text-white transition"
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
                <li>
                  <div className="flex flex-col gap-0">
                    <div className="flex items-center gap-3 lg:gap-[12px] py-2">
                      <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-white/80 flex-shrink-0" />
                      <span>info@casanest.sa</span>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-[12px] py-2">
                      <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-white/80 flex-shrink-0" />
                      <span>9200 123 456</span>
                    </div>
                    <div className="flex items-start gap-3 lg:gap-[12px] py-2">
                      <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-white/80 flex-shrink-0 mt-0.5" />
                      <span>{isRTL ? "شارع أحمد شوقي، أبراج المدينة الملكية، فوق رانين، البرج الثاني، الطابق الأول العلوي" : "Ahmed Shawki st. Royal City towers, above Ranin, second tower, first upper floor"}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Bar */}
      <div className="bg-[#c1cee8] w-full">
        <div className="content-container mx-auto p-[16px] lg:px-[60px] lg:py-[8px]">
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between gap-[16px] text-[14px] text-black/70 font-satoshi font-medium">
            <p className="text-center lg:text-left whitespace-nowrap">
              {isRTL
                ? `© ${new Date().getFullYear()} كازانست. جميع الحقوق محفوظة. مورد تجاري مسجل في مصر.`
                : `© ${new Date().getFullYear()} Casanest. All rights reserved. Registered commercial supplier in Egypt.`}
            </p>
            <div className="flex items-center gap-[16px] lg:gap-[24px]">
              <LocalizedClientLink href="/privacy" className="hover:text-[#17284a] transition-colors">
                {isRTL ? "سياسة الخصوصية" : "Privacy policy"}
              </LocalizedClientLink>
              <LocalizedClientLink href="/terms" className="hover:text-[#17284a] transition-colors">
                {isRTL ? "شروط الخدمة" : "Terms of service"}
              </LocalizedClientLink>
              <LocalizedClientLink href="/cookies" className="hover:text-[#17284a] transition-colors">
                {isRTL ? "إعدادات الكوكيز" : "Cookie settings"}
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}