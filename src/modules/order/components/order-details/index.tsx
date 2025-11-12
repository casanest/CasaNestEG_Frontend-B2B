import { cn } from "@lib/util/cn";
import { HttpTypes } from "@medusajs/types";
import { useLocale } from "next-intl";

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder;
  showStatus?: boolean;
};

const OrderDetails = ({ order, showStatus = false }: OrderDetailsProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Format status string to capitalized and spaced
  const formatStatus = (str: string): string => {
    const formatted = str.split("_").join(" ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Translate status based on locale with fallback
  const translateStatus = (status: string, locale: string): string => {
    const translations: Record<string, { en: string; ar: string }> = {
      pending: { en: "Pending", ar: "قيد الانتظار" },
      fulfilled: { en: "Order has been reviewed", ar: "تم مراجعة الطلب" },
      not_fulfilled: { en: "Order is being reviewed", ar: "جاري مراجعة الطلب" },
      canceled: { en: "Canceled", ar: "ملغى" },
      authorized: { en: "Authorized", ar: "مصرح" },
      captured: { en: "Captured", ar: "تم القبض" },
      refunded: { en: "Refunded", ar: "تم الاسترجاع" },
      shipped: { en: "Shipped", ar: "تم الشحن" },
      delivered: { en: "Delivered", ar: "تم التوصيل" },
    };

    if (translations[status]) {
      return locale === "ar" ? translations[status].ar : translations[status].en;
    }

    return locale === "ar" ? status : formatStatus(status);
  };

  // Define order steps in sequence
  const orderSteps = [
    {
      id: 0,
      status: "not_fulfilled",
      label: { en: "Processing", ar: "قيد المعالجة" },
      icon: "⚙️",
    },
    {
      id: 1,
      status: "fulfilled",
      label: { en: "Order has been reviewed", ar: "تم مراجعة الطلب" },
      icon: "✅",
    },
    {
      id: 2,
      status: "shipped",
      label: { en: "Shipped", ar: "تم الشحن" },
      icon: "🚚",
    },
    {
      id: 3,
      status: "delivered",
      label: { en: "Delivered", ar: "تم التوصيل" },
      icon: "⏳",
    },
  ];


  // Determine the current step index based on order status
  const getCurrentStep = (): number => {
    if (order.payment_status === "canceled") return -1; // special case

    switch (order.fulfillment_status) {
      case "not_fulfilled":
        return 0;
      case "fulfilled":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };


  const currentStep = getCurrentStep();
  const isCanceled = order.payment_status === "canceled";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6"
    >
      <h3 className="text-xl font-bold text-[#043364]">
        {isRTL ? "تفاصيل الطلب" : "Order Information"}
      </h3>

      <div className="space-y-2 text-gray-700 text-sm">
        <p>
          {isRTL ? "تم إرسال تأكيد الطلب إلى" : "Confirmation sent to"}:{" "}
          <span className="font-medium text-[#043364]" data-testid="order-email">
            {order.email}
          </span>
        </p>

        <p>
          {isRTL ? "تاريخ الطلب" : "Order Date"}:{" "}
          <span className="font-medium" data-testid="order-date">
            {new Date(order.created_at).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>

        <p>
          {isRTL ? "رقم الطلب" : "Order Number"}:{" "}
          <span className="font-medium text-[#043364]" data-testid="order-id">
            {order.display_id}
          </span>
        </p>
      </div>

      {showStatus && (
        <div className="mt-8">
          {/* Canceled status */}
          {isCanceled ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl" role="img" aria-label="Canceled">
                  ❌
                </span>
                <h4 className="text-lg font-bold text-red-700">
                  {translateStatus("canceled", locale)}
                </h4>
              </div>
              <p className="text-sm text-red-600">
                {isRTL ? "تم إلغاء هذا الطلب" : "This order has been canceled"}
              </p>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-8 overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    {isRTL ? "حالة الطلب" : "Order Status"}
                  </p>
                  {/* <p className="text-sm font-medium text-[#043364]">
                    {translateStatus(order.fulfillment_status || "", locale)}
                  </p> */}
                </div>

                {/* Progress Steps */}
                <div
                  className={cn(
                    "relative flex items-center w-full ",
                  )}
                >
                  {orderSteps.map((step, index) => {
                    // Determine if step is completed or active
                    const isCompleted = currentStep+1 > step.id;
                    const isActive = currentStep === step.id;

                    return (
                      <div
                        key={step.id}
                        className={cn(
                          "flex flex-col items-center flex-1",
                          // isRTL ? "text-right" : "text-left"
                        )}
                      >
                        {/* Step Circle & connecting lines */}
                        <div className="relative flex items-center w-full">
                          {/* Line Before (not for first step) */}
                          {index > 0 && (
                            <div
                              className={cn(
                                "absolute h-1 top-1/2 -translate-y-1/2 transition-all duration-500",
                                isRTL ? "right-1/2" : "left-1/2",
                                "w-full"
                              )}
                              style={{
                                background: isCompleted
                                  ? "linear-gradient(to right, #043364, #d9dfdeff)"
                                  : "#e5e7eb",
                              }}
                              aria-hidden="true"
                            />
                          )}

                          {/* Circle */}
                          <div
                            className={cn(
                              "relative z-10 flex items-center justify-center rounded-full transition-all duration-500 mx-auto",
                              isCompleted
                                ? "w-12 h-12 bg-gradient-to-tl from-gray-500 to-[#022a55] text-white  shadow-lg scale-110"
                                : "w-10 h-10 bg-gray-200",
                              isActive && "ring-4 ring-[#043364]/20 animate-pulse"
                            )}
                            aria-current={isActive ? "step" : undefined}
                            aria-label={
                              isActive
                                ? isRTL
                                  ? `الخطوة الحالية: ${step.label.ar}`
                                  : `Current step: ${step.label.en}`
                                : undefined
                            }
                          >
                            <span className="text-xl">
                              {isCompleted ? "✓" : step.icon}
                            </span>
                          </div>

                          {/* Line After (not for last step) */}
                          {index < orderSteps.length - 1 && (
                            <div
                              className={cn(
                                "absolute h-1 top-1/2 -translate-y-1/2 transition-all duration-500",
                                isRTL ? "left-1/2" : "right-0",
                                "w-full"
                              )}
                              style={{
                                background: isCompleted
                                  ? "linear-gradient(to right, #043364, #d9dfdeff)"
                                  : "#e5e7eb",
                              }}
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        {/* Label */}
                        <p
                          className={cn(
                            "mt-3 text-xs font-medium text-center transition-colors duration-300",
                            isCompleted
                              ? "text-[#043364] font-semibold"
                              : "text-gray-500"
                          )}
                        >
                          {isRTL ? step.label.ar : step.label.en}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <span aria-hidden="true" className="text-xl">
                        {orderSteps.find((s) => s.id === currentStep)?.icon || "📦"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {translateStatus(order.fulfillment_status || "", locale)}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {isRTL
                        ? currentStep === 3
                          ? "تم توصيل طلبك بنجاح!"
                          : "جاري العمل على طلبك"
                        : currentStep === 3
                          ? "Your order has been delivered!"
                          : "We're working on your order"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
