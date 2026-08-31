import React from "react"
import { LinkedinIcon } from "@modules/common/icons/linkedin"
import { FacebookIcon } from "@modules/common/icons/facebook"
import { XLogoIcon } from "@modules/common/icons/twitter"
import { InstagramIcon } from "@modules/common/icons/instagram"
import { YoutubeIcon } from "@modules/common/icons/youtube"
import { TiktokIcon } from "@modules/common/icons/tiktok"
import { WhatsappIcon } from "@modules/common/icons/whatsapp"
import { cn } from "@lib/util/cn"
import { formatNameForTestId } from "@lib/util/formatNameForTestId"
import type { SocialMediaLink } from "@lib/data/social-media"

const platformIconMap: Record<string, React.FC<any>> = {
  facebook: FacebookIcon,
  twitter: XLogoIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
  whatsapp: WhatsappIcon,
}

const platformLabelMap: Record<string, string> = {
  facebook: "Facebook",
  twitter: "X (Twitter)",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  snapchat: "Snapchat",
  pinterest: "Pinterest",
}

export function getPlatformIcon(platform: string): React.FC<any> | null {
  return platformIconMap[platform] || null
}

export function getPlatformLabel(platform: string): string {
  return platformLabelMap[platform] || platform
}

type SocialMediaLinksProps = {
  links: SocialMediaLink[]
  className?: string
  iconClassName?: string
  variant?: "footer" | "contact"
}

export default function SocialMediaLinks({
  links,
  className,
  iconClassName,
  variant = "footer",
}: SocialMediaLinksProps) {
  if (!links || links.length === 0) return null

  if (variant === "contact") {
    return (
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {links.map((link) => {
          const Icon = getPlatformIcon(link.platform)
          const label = link.label || getPlatformLabel(link.platform)
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              data-testid={formatNameForTestId(`${link.platform}-link`)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#043364]/20 text-[#043364] hover:bg-[#043364] hover:text-white transition",
                iconClassName
              )}
            >
              {Icon ? <Icon /> : <span className="text-xs font-bold">{link.platform[0].toUpperCase()}</span>}
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {links.map((link) => {
        const Icon = getPlatformIcon(link.platform)
        const label = link.label || getPlatformLabel(link.platform)
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={formatNameForTestId(`${link.platform}-link`)}
            aria-label={label}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition",
              iconClassName
            )}
          >
            {Icon ? <Icon /> : <span className="text-xs font-bold">{link.platform[0].toUpperCase()}</span>}
          </a>
        )
      })}
    </div>
  )
}
