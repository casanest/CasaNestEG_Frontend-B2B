"use client"

import { IconBadge, clx } from "@medusajs/ui"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { useLocale } from "next-intl"
import ChevronDown from "@modules/common/icons/chevron-down"

type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">

const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder, className, children, ...props }, ref) => {
    const locale = useLocale()
    const isRTL = locale === "ar"
    const defaultPlaceholder = isRTL ? "الكمية" : "Quantity"
    const finalPlaceholder = placeholder || defaultPlaceholder

    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true)
      } else {
        setIsPlaceholder(false)
      }
    }, [innerRef.current?.value])

    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <IconBadge
          onFocus={() => innerRef.current?.focus()}
          onBlur={() => innerRef.current?.blur()}
          className={clx(
            "relative flex items-center txt-compact-small border text-ui-fg-base group",
            className,
            {
              "text-ui-fg-subtle": isPlaceholder,
            }
          )}
        >
          <select
            ref={innerRef}
            {...props}
            className={clx(
              "appearance-none bg-transparent border-none px-4 transition-colors duration-150 focus:border-gray-700 outline-none w-16 h-16 items-center justify-center",
              {
                "text-right": isRTL,
                "text-left": !isRTL
              }
            )}
          >
            <option disabled value="">
              {finalPlaceholder}
            </option>
            {children}
          </select>
          <span className={clx("absolute flex pointer-events-none w-8 group-hover:animate-pulse", {
            "left-0": isRTL,
            "right-0": !isRTL
          })}>
            <ChevronDown className={clx({
              "rotate-180": isRTL
            })} />
          </span>
        </IconBadge>
      </div>
    )
  }
)

CartItemSelect.displayName = "CartItemSelect"

export default CartItemSelect