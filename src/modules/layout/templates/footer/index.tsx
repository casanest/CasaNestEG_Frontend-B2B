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

function SocialMedia({ className }: { className?: string }) {
  return (
    <Box className={cn("flex gap-2", className)}>
      <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-static">
        <LocalizedClientLink href="#" data-testid="linkedin-link">
          <LinkedinIcon />
        </LocalizedClientLink>
      </div>
      <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-static">
        <LocalizedClientLink href="#" data-testid="facebook-link">
          <FacebookIcon />
        </LocalizedClientLink>
      </div>
      <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-static">
        <LocalizedClientLink href="#" data-testid="x-link">
          <XLogoIcon />
        </LocalizedClientLink>
      </div>
    </Box>
  )
}

export default async function Footer() {
  const productCategories = await listCategories()
  const { collections } = await listCollections({ fields: "*products" })

  return (
    <Container
      as="footer"
      className="mx-0 max-w-full border-t border-basic-primary bg-static px-0 py-0 small:px-0 small:py-0 text-[#043364]"
    >
      <Container className="flex flex-col gap-6 text-static small:gap-12">
        <Box className="flex flex-col gap-8 small:gap-12 large:flex-row xl:gap-0">
          {/* Logo and Social Icons */}
          <Box className="flex flex-col justify-between xl:min-w-[437px]">
            <LocalizedClientLink
              href="/"
              className="text-3xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out leading-none"
              data-testid="nav-store-link"
            >
              <Image
                src="/lacasaLogo.png"
                alt="Logo"
                width={200}
                height={200}
              />
            </LocalizedClientLink>
            <SocialMedia className="hidden large:flex" />
          </Box>

          {/* Categories, Collections, and Links */}
          <Box className=" shrink grow gap-10 small:flex xl:gap-16">
            {productCategories && productCategories.length > 0 && (
              <Box className="flex flex-col gap-y-2">
                <Heading as="h3" className="mb-2 text-lg font-semibold">
                  Categories
                </Heading>
                <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
                  {productCategories.slice(0, 6).map((c) => {
                    if (c.parent_category) return null

                    const children = c.category_children?.map(child => ({
                      name: child.name,
                      handle: child.handle,
                      id: child.id
                    })) ?? null

                    return (
                      <li key={c.id} className="flex flex-col gap-2 text-static">
                        <LocalizedClientLink
                          href={`/categories/${c.handle}`}
                          className={cn("w-max hover:text-static hover:font-semibold text-static ", children )}
                          data-testid={formatNameForTestId(`${c.name}-link`)}
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="ml-3 grid grid-cols-1 gap-2">
                            {children.map(child => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  href={`/categories/${child.handle}`}
                                  className="hover:text-static"
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

            {collections && collections.length > 0 && (
              <Box className="flex flex-col gap-y-2">
                <Heading as="h3" className="mb-2 text-lg">
                  Collections
                </Heading>
                <ul className="grid grid-cols-1 gap-2 text-static">
                  {collections.slice(0, 6).map(c => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/collections/${c.handle}`}
                        className="w-max hover:text-static hover:font-semibold text-static "
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
              <ul className="grid grid-cols-1 gap-y-2 text-static">
                <li>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="w-max hover:text-static hover:font-semibold text-static ">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://docs.company.com" target="_blank" rel="noreferrer" className="w-max hover:text-static hover:font-semibold text-static ">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://example.com/source" target="_blank" rel="noreferrer" className="w-max hover:text-static hover:font-semibold text-static ">
                    Source Code
                  </a>
                </li>
              </ul>
            </Box>
          </Box>

          {/* Social Media (for small viewports) */}
          <SocialMedia className="flex large:hidden" />
        </Box>

        <Divider alignment="horizontal" variant="secondary" />

        {/* Bottom bar */}
        <Box className="flex flex-wrap gap-6 gap-y-1 justify-center items-center">
          <Text size="md" className="shrink-0 text-secondary">
            © {new Date().getFullYear()} LA CASA. All rights reserved.
          </Text>
        </Box>

      </Container>
    </Container>
  )
}
