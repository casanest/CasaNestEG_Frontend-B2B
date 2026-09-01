"use client"

import Image from "next/image"

type PartnerLogoProps = {
    name: string
    logoGray: string
    logoColor: string
}

export default function PartnerLogo({
    name,
    logoGray,
    logoColor,
}: PartnerLogoProps) {
    return (
        <div className="w-[clamp(100px,10vw,140px)] h-[clamp(50px,5vw,70px)] md:w-[clamp(160px,16vw,220px)] md:h-[clamp(72px,7vw,100px)] bg-transparent transition duration-300 flex items-center justify-center group cursor-pointer">
            <div className="relative w-full h-full flex items-center justify-center animate-float">
                {/* Gray Logo */}
                <Image
                    src={logoGray}
                    alt={name}
                    fill
                    sizes="(min-width: 768px) 220px, 140px"
                    className="object-contain transition duration-500 opacity-100 group-hover:opacity-0"
                />

                {/* Colored Logo */}
                <Image
                    src={logoColor}
                    alt={name}
                    fill
                    sizes="(min-width: 768px) 220px, 140px"
                    className="object-contain transition duration-500 opacity-0 group-hover:opacity-100"
                />
            </div>
        </div>
    )
}