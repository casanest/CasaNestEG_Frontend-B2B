import { ArrowUpRightMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";
import { Metadata } from "next";
import k from "@lib/i18n/translations/keys";
import { Link } from "@lib/i18n/navigation";
import { useSafeTranslations } from "@lib/i18n/use-safe-translations";
import { useLocale } from "next-intl"; // أو أي hook تستخدمه لجلب اللغة

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
};

export default function NotFound() {
  const t = useSafeTranslations();

  const locale = useLocale(); // "ar", "en", ...
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <div dir={dir} className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">{t(k.PAGE_NOT_FOUND)}</h1>
      <p className="text-small-regular text-ui-fg-base">
        {t(k.THE_PAGE_YOU_TRIED_TO_ACCESS_D)}
      </p>
      <Link
        href="/"
        className={`flex items-center gap-x-1 group ${dir === "rtl" ? "flex-row-reverse" : "flex-row"
          }`}
          dir={dir}
      >
        <Text className={`text-ui-fg-interactive ${dir === "rtl" ? "items-right" : "group-hover:translate-x-1"}`}>{t(k.GO_TO_FRONTPAGE)}</Text>
        <ArrowUpRightMini
          className={`ease-in-out duration-150 ${dir === "rtl" ? "group-hover:-rotate-45" : "group-hover:rotate-45"
            }`}
          color="var(--fg-interactive)"
        />
      </Link>
    </div>
  );
}
