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
import { motion } from "framer-motion";

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

function SocialMedia({ className, locale }: { className?: string; locale: string }) {
  const isRTL = locale === "ar";
  const socials = [
    { href: "#", icon: <LinkedinIcon />, label: "LinkedIn", testId: "linkedin-link", color: "hover:bg-blue-100" },
    { href: "#", icon: <FacebookIcon />, label: "Facebook", testId: "facebook-link", color: "hover:bg-blue-50" },
    { href: "#", icon: <XLogoIcon />, label: "X (Twitter)", testId: "x-link", color: "hover:bg-gray-100" },
  ];

  return (
    <Box className={cn("flex gap-3", className)}>
      {socials.map(({ href, icon, label, testId, color }) => (
        <motion.div
          key={testId}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full text-[#043364] border border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md",
            color
          )}
        >
          <LocalizedClientLink href={href} data-testid={testId} aria-label={label}>
            {icon}
          </LocalizedClientLink>
        </motion.div>
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
      className="mx-0 max-w-full  px-0 py-0 text-[#043364] border-t border-gray-200"
    >
      <Container className="flex flex-col gap-12 small:gap-16 text-static small:px-6 py-12 small:py-16">
        {/* Main Footer Content */}
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <Box className="lg:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <LocalizedClientLink
                href="/"
                className="inline-block mb-4"
                data-testid="nav-store-link"
                aria-label="Homepage"
              >
                <Image
                  src="/lacasaLogo.png"
                  alt="La Casa Logo"
                  width={180}
                  height={180}
                  priority
                  className="hover:scale-105 transition-transform duration-300"
                />
              </LocalizedClientLink>

              <Text className="text-gray-600 text-sm leading-relaxed max-w-sm">
                {isRTL
                  ? "وجهتك المثالية للتسوق الإلكتروني. نوفر لك أفضل المنتجات بأفضل الأسعار مع خدمة توصيل سريعة وموثوقة."
                  : "Your ultimate destination for online shopping. We provide you with the best products at the best prices with fast and reliable delivery."}
              </Text>

              <Box className="mt-6">
                <Heading as="h4" className="text-sm font-semibold mb-3">
                  {isRTL ? "تابعنا على" : "Follow Us"}
                </Heading>
                <SocialMedia locale={locale} />
              </Box>
            </motion.div>
          </Box>
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Box className="flex flex-col gap-4">
              <Heading as="h3" className="text-lg font-bold relative inline-block">
                {isRTL ? "روابط سريعة" : "Quick Links"}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#043364] to-teal-500 rounded-full"></span>
              </Heading>
              <ul className="grid gap-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: isRTL ? -5 : 5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-teal-500 text-xs">›</span>
                    <LocalizedClientLink
                      href={link.href}
                      className="text-gray-600 hover:text-[#043364] hover:font-medium transition-all text-sm"
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </motion.li>
                ))}
              </ul>
            </Box>
          </motion.div>


          {/* Categories */}
          {productCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Box className="flex flex-col gap-4">
                <Heading as="h3" className="text-lg font-bold relative inline-block">
                  {isRTL ? "الفئات" : "Categories"}
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#043364] to-teal-500 rounded-full"></span>
                </Heading>
                <ul className="grid gap-3" data-testid="footer-categories">
                  {productCategories.slice(0, 6).map((c) => (
                    <motion.li
                      key={c.id}
                      whileHover={{ x: isRTL ? -5 : 5 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-teal-500 text-xs">›</span>
                      <LocalizedClientLink
                        href={`/categories/${isRTL ? c.handle_ar ?? c.handle_en : c.handle_en ?? c.handle_ar}`}
                        className="text-gray-600 hover:text-[#043364] hover:font-medium transition-all text-sm"
                        data-testid={formatNameForTestId(`${c.name_en}-link`)}
                      >
                        {isRTL ? c.name_ar : c.name_en}
                      </LocalizedClientLink>
                    </motion.li>
                  ))}
                </ul>
              </Box>
            </motion.div>
          )}

          {/* Collections */}
          {collections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Box className="flex flex-col gap-4">
                <Heading as="h3" className="text-lg font-bold relative inline-block">
                  {isRTL ? "المجموعات" : "Collections"}
                  <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#043364] to-teal-500 rounded-full"></span>
                </Heading>
                <ul className="grid gap-3">
                  {collections.slice(0, 6).map((c) => (
                    <motion.li
                      key={c.id}
                      whileHover={{ x: isRTL ? -5 : 5 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-teal-500 text-xs">›</span>
                      <LocalizedClientLink
                        href={`/collections/${isRTL ? c.handle_ar ?? c.handle_en : c.handle_en ?? c.handle_ar}`}
                        className="text-gray-600 hover:text-[#043364] hover:font-medium transition-all text-sm"
                        data-testid={formatNameForTestId(`${c.name_en}-link`)}
                      >
                        {isRTL ? c.name_ar : c.name_en}
                      </LocalizedClientLink>
                    </motion.li>
                  ))}
                </ul>
              </Box>
            </motion.div>
          )}


          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Box className="flex flex-col gap-4">
              <Heading as="h3" className="text-lg font-bold relative inline-block">
                {isRTL ? "تواصل معنا" : "Contact Us"}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#043364] to-teal-500 rounded-full"></span>
              </Heading>
              <ul className="grid gap-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>support@lacasa.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+1 234 567 8900</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{isRTL ? "القاهرة، مصر" : "Cairo, Egypt"}</span>
                </li>
              </ul>
            </Box>
          </motion.div>
        </Box>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Divider alignment="horizontal" variant="secondary" />
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Box className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <Text size="sm">
              {isRTL
                ? `© ${new Date().getFullYear()} جميع الحقوق محفوظة ل CASANEST`
                : `© ${new Date().getFullYear()} All rights reserved to CASANEST`}
            </Text>

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

          {/* Payment Methods */}
          {/* <Box className="flex justify-center items-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <Text size="xs" className="text-gray-500">
              {isRTL ? "طرق الدفع المقبولة:" : "Accepted Payment Methods:"}
            </Text>
            <Box className="flex gap-2">
              {["💳", "🏦", "📱", "💰"].map((icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center text-xl"
                >
                  {icon}
                </motion.div>
              ))}
            </Box>
          </Box> */}
        </motion.div>
      </Container>
    </Container>
  );
}