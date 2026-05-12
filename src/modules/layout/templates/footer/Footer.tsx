"use client";

import { cn } from "@lib/util/cn";
import { formatNameForTestId } from "@lib/util/formatNameForTestId";
import { Box } from "@modules/common/components/box";
import { Container } from "@modules/common/components/container";
import Divider from "@modules/common/components/divider";
import { Heading } from "@modules/common/components/heading";
import { Text } from "@modules/common/components/text";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { LinkedinIcon } from "@modules/common/icons/linkedin";
import { FacebookIcon } from "@modules/common/icons/facebook";
import { XLogoIcon } from "@modules/common/icons/twitter";
import Image from "next/image";

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
    <Box className={cn("flex items-center gap-3", className)}>
      {socials.map(({ href, icon, label, testId }) => (
        <LocalizedClientLink
          key={testId}
          href={href}
          data-testid={testId}
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-[#043364] hover:bg-gray-100 transition"
        >
          {icon}
        </LocalizedClientLink>
      ))}
    </Box>
  );
}

interface FooterProps {
  productCategories: ProductCategory[];
  collections: ApiCollection[];
  locale: string;
}

export default function Footer({ productCategories, collections, locale }: FooterProps) {
  const isRTL = locale === "ar";

  const quickLinks = [
    { href: "/store", label: isRTL ? "المنتجات" : "Store" },
    { href: "/account", label: isRTL ? "الحساب" : "Account" },
    { href: "/account/orders", label: isRTL ? "الطلبات" : "Orders" },
    { href: "/returns", label: isRTL ? "سياسة الإرجاع" : "Return Policy" },
  ];

  return (
    <Container
      as="footer"
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-0 max-w-full !px-0 !py-0 text-[#043364] border-t border-gray-200 bg-white mt-10"
    >
      <Container className="flex flex-col gap-10 small:gap-12 text-static !px-4 small:!px-6 !py-8 small:!py-10">
        {/* Main Footer Content */}
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Logo & Description */}
          <Box className={cn("flex flex-col gap-4", isRTL ? "text-right" : "text-left")}>
            <LocalizedClientLink
              href="/"
              className="inline-block"
              data-testid="nav-store-link"
              aria-label="Homepage"
            >
              <Image src="/casanest.png" alt="CASANEST Logo" width={200} height={100} priority />
            </LocalizedClientLink>

            <Text className="text-gray-600 text-sm leading-relaxed">
              {isRTL
                ? "يوفر حلول متكاملة للأثاث والأجهزة والتقنية لتجهيز جميع المساحات بجودة عالية."
                : "Integrated solutions for furniture, appliances, and tech to equip spaces with high quality."}
            </Text>

            <SocialMedia />
          </Box>

          {/* Quick Links */}
          <Box className={cn("flex flex-col gap-3", isRTL ? "text-right" : "text-left")}>
            <Heading as="h3" className="text-sm font-semibold">
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </Heading>
            <ul className="grid gap-2 text-sm text-gray-600">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <LocalizedClientLink
                    href={link.href}
                    className="hover:text-[#043364] transition"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </Box>


          {/* Categories */}
          {productCategories.length > 0 && (
            <Box className={cn("flex flex-col gap-3", isRTL ? "text-right" : "text-left")}>
              <Heading as="h3" className="text-sm font-semibold">
                {isRTL ? "الأقسام" : "Categories"}
              </Heading>
              <ul className="grid gap-2 text-sm text-gray-600" data-testid="footer-categories">
                {productCategories.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/categories/${isRTL ? c.handle_ar ?? c.handle_en : c.handle_en ?? c.handle_ar}`}
                      className="hover:text-[#043364] transition"
                      data-testid={formatNameForTestId(`${c.name_en}-link`)}
                    >
                      {isRTL ? c.name_ar : c.name_en}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {/* Collections */}
          {collections.length > 0 && (
            <Box className={cn("flex flex-col gap-3", isRTL ? "text-right" : "text-left")}>
              <Heading as="h3" className="text-sm font-semibold">
                {isRTL ? "المجموعات" : "Collections"}
              </Heading>
              <ul className="grid gap-2 text-sm text-gray-600">
                {collections.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/collections/${isRTL ? c.handle_ar ?? c.handle_en : c.handle_en ?? c.handle_ar}`}
                      className="hover:text-[#043364] transition"
                      data-testid={formatNameForTestId(`${c.name_en}-link`)}
                    >
                      {isRTL ? c.name_ar : c.name_en}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </Box>
          )}


          {/* Contact Info */}
          <Box className={cn("flex flex-col gap-3", isRTL ? "text-right" : "text-left")}>
            <Heading as="h3" className="text-sm font-semibold">
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </Heading>
            <ul className="grid gap-2 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#043364] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>info@casanest.sa</span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#043364] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>9200 123 456</span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#043364] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{isRTL ? "الفيوم، مصر" : "Fayoum, Egypt"}</span>
              </li>
            </ul>
          </Box>
        </Box>

        {/* Divider */}
        <Divider alignment="horizontal" variant="secondary" />

        {/* Footer Bottom */}
        <Box className={cn("flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-600", isRTL ? "sm:flex-row-reverse" : "")}
        >
          <Box className="flex flex-col items-center sm:items-start gap-1">
            <Text size="sm">
              {isRTL
                ? `© ${new Date().getFullYear()} جميع الحقوق محفوظة ل CASANEST`
                : `© ${new Date().getFullYear()} All rights reserved to CASANEST`}
            </Text>
            <Text size="sm">
              {isRTL ? "تم تنفيذ هذا الموقع بواسطة شركة EcoZom" : "Website built by EcoZom"}
            </Text>
          </Box>

          <Box className="flex items-center gap-4">
            <LocalizedClientLink href="/privacy" className="hover:text-[#043364] transition-colors">
              {isRTL ? "الخصوصية" : "Privacy"}
            </LocalizedClientLink>
            <span className="text-gray-300">|</span>
            <LocalizedClientLink href="/terms" className="hover:text-[#043364] transition-colors">
              {isRTL ? "الشروط" : "Terms"}
            </LocalizedClientLink>
            <span className="text-gray-300">|</span>
            <LocalizedClientLink href="/cookies" className="hover:text-[#043364] transition-colors">
              {isRTL ? "الكوكيز" : "Cookies"}
            </LocalizedClientLink>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}