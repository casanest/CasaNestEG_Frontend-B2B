import { ArrowUpRightMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";
import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
};

export default async function NotFound() {
  const t = await getTranslations("not-found");

  const locale = await getLocale(); // "ar", "en", ...

  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <div dir={dir} className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">
        {t("title")}
      </h1>
      <p className="text-small-regular text-ui-fg-base">
        {t("description")}
      </p>
      <Link
        href={`/${locale}`} // تأكد من أن الرابط يتضمن اللغة
        className={`flex items-center gap-x-1 group ${dir === "rtl" ? "flex-row-reverse" : "flex-row"
          }`}
        dir={dir}
      >
        <Text className={`text-ui-fg-interactive ${dir === "rtl" ? "items-right" : "group-hover:translate-x-1"}`}>
          {t("back_to_home")}
        </Text>
        <ArrowUpRightMini
          className={`ease-in-out duration-150 ${dir === "rtl" ? "group-hover:-rotate-45" : "group-hover:rotate-45"
            }`}
          color="var(--fg-interactive)"
        />
      </Link>
    </div>
  );
}
