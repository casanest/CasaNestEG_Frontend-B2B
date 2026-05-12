import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { useLocale } from "next-intl"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  const locale = useLocale()
  const isRTL = locale === "ar"


  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis"
    >
      {/* Variant: {variant?.title} */}
      {isRTL ? "النوع: " : " Variant: "}{isRTL ? (variant?.metadata?.localizations?.ar.title as string) ?? variant?.title
        : variant?.title}
      {/* {variant?.title &&
        variant.title.trim().toLowerCase() !== "default variant" && (
          <>
            {isRTL ? "النوع: " : "Variant: "}
            {isRTL
              ? (variant?.metadata?.localizations?.ar?.title as string) ??
              variant.title
              : variant.title}
          </>
        )} */}
    </Text>
  )
}

export default LineItemOptions
