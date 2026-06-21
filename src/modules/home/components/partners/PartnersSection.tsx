// "use client"

import PartnerLogo from "./PartnerLogo"
import { useLocale, useTranslations } from "next-intl"

const partners = [
    {
        id: 1,
        name: "Partner 1",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 2,
        name: "Partner 2",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 3,
        name: "Partner 3",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 4,
        name: "Partner 4",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 5,
        name: "Partner 5",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 6,
        name: "Partner 6",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 7,
        name: "Partner 7",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 8,
        name: "Partner 8",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 9,
        name: "Partner 9",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 10,
        name: "Partner 10",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 11,
        name: "Partner 11",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 12,
        name: "Partner 12",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 13,
        name: "Partner 13",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
    {
        id: 14,
        name: "Partner 14",
        logoGray: "/partners/partner1-gray.png",
        logoColor: "/partners/partner1-color.png",
    },
]

const firstRow = partners.slice(0, 7)
const secondRow = partners.slice(7, 14)

export default function PartnersSection() {
    const locale = useLocale()
    const isRTL = locale === "ar"
    const t = useTranslations("home.partners")

    return (
        <section dir="ltr" className="  bg-white overflow-hidden py-6">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <div className="text-center mb-5 md:mb-10">
                    <p className="text-[12px] md:text-[14px] font-medium text-gray-500 uppercase tracking-[3px] mb-2">
                        {t("trustedBy")}
                    </p>

                    <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#152451]">
                        {t("title")}
                    </h2>

                    <p className="text-[13px] md:text-base text-gray-600 mt-2 md:mt-4 max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </div>

                {/* First Row → Left */}
                <div className="mb-8 overflow-hidden">
                    <div className="flex gap-8 w-max animate-scroll-left">
                        {[...firstRow, ...firstRow].map((partner, index) => (
                            <PartnerLogo
                                key={`${partner.id}-${index}`}
                                name={partner.name}
                                logoGray={partner.logoGray}
                                logoColor={partner.logoColor}
                            />
                        ))}
                    </div>
                </div>

                {/* Second Row → Right */}
                <div className="overflow-hidden">
                    <div className="flex gap-8 w-max animate-scroll-right">
                        {[...secondRow, ...secondRow].map((partner, index) => (
                            <PartnerLogo
                                key={`${partner.id}-${index}`}
                                name={partner.name}
                                logoGray={partner.logoGray}
                                logoColor={partner.logoColor}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}