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

// interface ApiCollection {
//   id: string
//   title: string
//   handle: string
//   created_at: string
//   updated_at: string
//   deleted_at: string | null
//   metadata: {
//     localizations?: {
//       ar?: {
//         title?: string
//         handle?: string
//       }
//     }
//     available_languages?: string[]
//     localization_updated_at?: string
//   } | null
// }
interface ApiCollection {
    id: string
    name_en: string
    name_ar: string
    handle_en: string
    handle_ar: string
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
    <Box className={cn("flex gap-2", className)}>
      {socials.map(({ href, icon, label, testId }) => (
        <div
          key={testId}
          className="flex h-12 w-12 items-center justify-center rounded-full text-static hover:bg-blue-100 transition-colors"
        >
          <LocalizedClientLink href={href} data-testid={testId} aria-label={label}>
            {icon}
          </LocalizedClientLink>
        </div>
      ))}
    </Box>
  );
}

interface FooterProps {
  productCategories: Category[];
  collections: ApiCollection[];
  locale: string;
}

export default function Footer({ productCategories, collections, locale }: FooterProps) {
  const isRTL = locale === "ar";
  console.log("collections", collections)
  return (
    <Container
      as="footer"
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-0 max-w-full border-t border-basic-primary bg-static px-0 py-0 text-[#043364]"
    >
      <Container className="flex flex-col gap-6 small:gap-12 text-static px-4 py-6 small:px-6">
        <Box className="flex flex-col gap-8 md:flex-row xl:gap-0">
          {/* Logo & Social */}
          <Box className="flex flex-col justify-between xl:min-w-[437px] gap-4">
            <LocalizedClientLink
              href="/"
              className="inline-block"
              data-testid="nav-store-link"
              aria-label="Homepage"
            >
              <Image
                src="/lacasaLogo.png"
                alt="La Casa Logo"
                width={200}
                height={200}
                priority
              />
            </LocalizedClientLink>
          </Box>

          {/* Links */}
          <Box className="flex flex-wrap justify-around gap-10 xl:gap-16 flex-grow">
            {productCategories.length > 0 && (
              <Box className="flex flex-col gap-y-2">
                <Heading as="h3" className="mb-2 text-lg font-semibold">
                  {isRTL ? "الفئات" : "Categories"}
                </Heading>
                <ul className="grid gap-2" data-testid="footer-categories">
                  {productCategories.slice(0, 6).map((c) => (
                    <li key={c.id} className="flex flex-col gap-2">
                      <LocalizedClientLink
                        href={`/categories/${c.handle}`}
                        className="hover:font-semibold"
                        data-testid={formatNameForTestId(`${c.name_en}-link`)}
                      >
                        {isRTL ? c.name_ar : c.name_en}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            {collections.length > 0 && (
              <Box className="flex flex-col gap-y-2">
                <Heading as="h3" className="mb-2 text-lg font-semibold">
                  {isRTL ? "المجموعات" : "Collections"}
                </Heading>
                <ul className="grid gap-2">
                  {collections.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/collections/${c.handle_en}`}
                        className="hover:font-semibold"
                        data-testid={formatNameForTestId(`${c.name_en}-link`)}
                      >
                        {isRTL ? c.name_ar : c.name_en}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            {/* <Box className="flex flex-col gap-y-2">
              <Heading as="h3" className="mb-2 text-lg font-semibold">
                {isRTL ? "الموارد" : "Resources"}
              </Heading>
              <ul className="grid gap-y-2">
                <li>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:font-semibold">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://docs.company.com" target="_blank" rel="noreferrer" className="hover:font-semibold">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://example.com/source" target="_blank" rel="noreferrer" className="hover:font-semibold">
                    Source Code
                  </a>
                </li>
              </ul>
            </Box> */}
            <Box className="flex flex-col gap-y-2">
              <Heading as="h3" className="mb-2 text-lg font-semibold">
                {isRTL ? "تابعنا" : "Follow Us"}
              </Heading>
              {/* Social on mobile */}
              <SocialMedia className="hidden large:flex" />

              <SocialMedia className="flex large:hidden" />
            </Box>
          </Box>

        </Box>

        <Divider alignment="horizontal" variant="secondary" />

        {/* Footer Bottom */}
        <Box className="flex flex-wrap justify-center items-center gap-4 text-sm text-secondary">
          <Text size="md">
            {isRTL
              ? `© ${new Date().getFullYear()} جميع الحقوق محفوظة ل La Casa`
              : `© ${new Date().getFullYear()} All rights reserved to La Casa`}
          </Text>
        </Box>
      </Container>
    </Container>
  );
}
