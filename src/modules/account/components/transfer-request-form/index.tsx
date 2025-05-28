"use client"

import { useActionState } from "react"
import { createTransferRequest } from "@lib/data/orders"
import { Text, Heading, Input, Button, IconButton } from "@medusajs/ui"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { clx } from "@medusajs/ui"

export default function TransferRequestForm() {
  const locale = useLocale()
  const isRTL = locale === "ar"
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col gap-y-4 w-full"
    >
      <div className={clx(
        "grid items-center gap-x-8 gap-y-4 w-full",
        {
          "sm:grid-cols-2": !isRTL,
          "sm:grid-cols-[1fr_auto]": isRTL
        }
      )}>
        <div className="flex flex-col gap-y-1">
          <Heading level="h3" className="text-lg text-ui-fg-base">
            {isRTL ? "تحويلات الطلبات" : "Order transfers"}
          </Heading>
          <Text className="text-base-regular text-ui-fg-subtle">
            {isRTL ? (
              <>
                لا يمكنك العثور على الطلب الذي تبحث عنه؟
                <br /> قم بربط الطلب بحسابك.
              </>
            ) : (
              <>
                Can&apos;t find the order you are looking for?
                <br /> Connect an order to your account.
              </>
            )}
          </Text>
        </div>
        <form
          action={formAction}
          className={clx("flex flex-col gap-y-1", {
            "sm:items-end": !isRTL,
            "sm:items-start": isRTL
          })}
        >
          <div className="flex flex-col gap-y-2 w-full">
            <Input
              className="w-full"
              name="order_id"
              placeholder={isRTL ? "معرف الطلب" : "Order ID"}
            />
            <SubmitButton
              variant="secondary"
              className={clx("w-fit whitespace-nowrap", {
                "self-end": !isRTL,
                "self-start": isRTL
              })}
            >
              {isRTL ? "طلب النقل" : "Request transfer"}
            </SubmitButton>
          </div>
        </form>
      </div>
      {!state.success && state.error && (
        <Text className={clx(
          "text-base-regular text-rose-500",
          {
            "text-right": isRTL,
            "text-left": !isRTL
          }
        )}>
          {state.error}
        </Text>
      )}
      {showSuccess && (
        <div className={clx(
          "flex justify-between p-4 bg-ui-bg-subtle shadow-borders-base w-full items-center rounded-lg",
          {
            "flex-row-reverse": isRTL
          }
        )}>
          <div className="flex gap-x-2 items-center">
            <CheckCircleMiniSolid className="w-4 h-4 text-ui-tag-green-icon" />
            <div className="flex flex-col gap-y-1">
              <Text className="text-medim-pl text-ui-fg-base">
                {isRTL ? (
                  <>تم طلب نقل الطلب {state.order?.id}</>
                ) : (
                  <>Transfer for order {state.order?.id} requested</>
                )}
              </Text>
              <Text className="text-base-regular text-ui-fg-subtle">
                {isRTL ? (
                  <>تم إرسال طلب النقل إلى {state.order?.email}</>
                ) : (
                  <>Transfer request email sent to {state.order?.email}</>
                )}
              </Text>
            </div>
          </div>
          <IconButton
            variant="transparent"
            className="h-fit"
            onClick={() => setShowSuccess(false)}
          >
            <XCircleSolid className="w-4 h-4 text-ui-fg-muted" />
          </IconButton>
        </div>
      )}
    </div>
  )
}