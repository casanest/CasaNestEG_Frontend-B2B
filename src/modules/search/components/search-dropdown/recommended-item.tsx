import { StoreProduct } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'
import Thumbnail from '@modules/products/components/thumbnail'
import { useLocale } from 'next-intl'
import { getLocale } from 'next-intl/server'

export const RecommendedItem = ({
  item,
}: {
  item: StoreProduct
}) => {

  const locale = useLocale(); // "ar", "en", ...

  const isRTL = locale === "ar"
  return (
    <LocalizedClientLink
      href={`/products/${item.handle}`}

    >
      <Box
        className="flex w-full bg-primary transition-all duration-300 ease-in-out hover:bg-[#f5f8fc] rounded-large"
        data-testid="product-row"
      >
        <div className="flex h-[90px] w-[90px]">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
        <Box className="px-4 pt-3 medium:flex-grow">
          <Text className="text-lg" data-testid="product-name">
            {isRTL
              ? ((item.metadata as any)?.localizations?.ar?.title as string) ?? item.title
              : item.handle}
          </Text>
          {item.variants && (
            <Text size="md" className="text-secondary">
              {item.variants[0]?.title}
            </Text>
          )}
        </Box>
      </Box>
    </LocalizedClientLink>
  )
}
