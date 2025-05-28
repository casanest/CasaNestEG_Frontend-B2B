import { Heading, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLocale } from "next-intl"

const Help = () => {
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <div
      className="mt-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Heading
        className={clx("text-base-semi mb-2", {
          "text-right": isRTL,
          "text-left": !isRTL
        })}
      >
        {isRTL ? "هل تحتاج مساعدة؟" : "Need help?"}
      </Heading>

      <div className={clx("text-base-regular", {
        "text-right": isRTL,
        "text-left": !isRTL
      })}>
        <ul className={clx("gap-y-2 flex flex-col", {
          "pr-4": isRTL,
          "pl-4": !isRTL
        })}>
          <li>
            <LocalizedClientLink
              href="/contact"
              className="hover:text-ui-fg-interactive transition-colors"
            >
              {isRTL ? "اتصل بنا" : "Contact"}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink
              href="/returns"
              className="hover:text-ui-fg-interactive transition-colors"
            >
              {isRTL ? "المرتجعات والاستبدال" : "Returns & Exchanges"}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help