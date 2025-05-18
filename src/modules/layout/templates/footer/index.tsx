// "use client"

import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { cn } from "@lib/util/cn"
import { formatNameForTestId } from "@lib/util/formatNameForTestId"
import { Box } from "@modules/common/components/box"
import { Container } from "@modules/common/components/container"
import Divider from "@modules/common/components/divider"
import { Heading } from "@modules/common/components/heading"
import { Text } from "@modules/common/components/text"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { LaCasaLogo } from "@modules/common/icons/solace-logo"
import { LinkedinIcon } from "@modules/common/icons/linkedin"
import { FacebookIcon } from "@modules/common/icons/facebook"
import { XLogoIcon } from "@modules/common/icons/twitter"
import Image from "next/image"
import { getLocale } from "next-intl/server"

function SocialMedia({ className }: { className?: string }) {
  const socials = [
    { href: "#", icon: <LinkedinIcon />, label: "LinkedIn", testId: "linkedin-link" },
    { href: "#", icon: <FacebookIcon />, label: "Facebook", testId: "facebook-link" },
    { href: "#", icon: <XLogoIcon />, label: "X (Twitter)", testId: "x-link" },
  ]

  return (
    <Box className={cn("flex gap-2", className)}>
      {socials.map(({ href, icon, label, testId }) => (
        <div
          key={testId}
          className="flex h-12 w-12 items-center justify-center rounded-full text-static hover:bg-blue-100 transition-colors"
        >
          <LocalizedClientLink
            href={href}
            data-testid={testId}
            aria-label={label}
          >
            {icon}
          </LocalizedClientLink>
        </div>
      ))}
    </Box>
  )
}

export default async function Footer() {
  const productCategories = await listCategories()
  const { collections } = await listCollections({ fields: "*products" })
  const locale = await getLocale()
  const isRTL = locale === "ar"

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
            <SocialMedia className="hidden large:flex" />
          </Box>

          {/* Links */}
          <Box className="flex flex-wrap justify-between gap-10 xl:gap-16 flex-grow">
            {productCategories.length > 0 && (
              <Box className="flex flex-col gap-y-2">
                <Heading as="h3" className="mb-2 text-lg font-semibold">Categories</Heading>
                <ul className="grid gap-2" data-testid="footer-categories">
                  {productCategories.slice(0, 6).map(c => {
                    if (c.parent_category) return null
                    const children = c.category_children ?? []

                    return (
                      <li key={c.id} className="flex flex-col gap-2">
                        <LocalizedClientLink
                          href={`/categories/${c.handle}`}
                          className="hover:font-semibold"
                          data-testid={formatNameForTestId(`${c.name}-link`)}
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children.length > 0 && (
                          <ul className={`${isRTL ? "mr-3" : "ml-3"} grid gap-1`}>
                            {children.map(child => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  href={`/categories/${child.handle}`}
                                  className="text-sm hover:text-blue-800"
                                  data-testid={formatNameForTestId(`${child.name}-link`)}
                                >
                                  {child.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </Box>
            )}

            {collections.length > 0 && (
              <Box className="flex flex-col gap-y-2">
                <Heading as="h3" className="mb-2 text-lg font-semibold">Collections</Heading>
                <ul className="grid gap-2">
                  {collections.slice(0, 6).map(c => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/collections/${c.handle}`}
                        className="hover:font-semibold"
                        data-testid={formatNameForTestId(`${c.title}-link`)}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            <Box className="flex flex-col gap-y-2">
              <Heading as="h3" className="mb-2 text-lg font-semibold">Company</Heading>
              <ul className="grid gap-y-2">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:font-semibold"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.company.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:font-semibold"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://example.com/source"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:font-semibold"
                  >
                    Source Code
                  </a>
                </li>
              </ul>
            </Box>
          </Box>

          {/* Social on mobile */}
          <SocialMedia className="flex large:hidden" />
        </Box>

        <Divider alignment="horizontal" variant="secondary" />

        {/* Footer Bottom */}
        <Box className="flex flex-wrap justify-center items-center gap-4 text-sm text-secondary">
          <Text size="md">© {new Date().getFullYear()} LA CASA. All rights reserved.</Text>
        </Box>
      </Container>
    </Container>
  )
}
