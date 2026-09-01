import { useTranslations } from "next-intl"

type StatsBarProps = {
  dir: string
}

export default function StatsBar({ dir }: StatsBarProps) {
  const t = useTranslations("home.stats")

  const stats = [
    { value: "500+", label: t("enterpriseClients") },
    { value: "27", label: t("governorateCoverage") },
    { value: "25+ Years", label: t("inMarket") },
  ]

  return (
    <section
      className="hidden md:flex bg-[#141b34] items-start justify-between p-[clamp(20px,4vw,60px)] w-full"
      dir={dir}
    >
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-[clamp(6px,0.6vw,8px)] items-center flex-1"
        >
          <p className="text-[#fdb022] text-[clamp(24px,3.5vw,48px)] leading-[1.1] font-bold">
            {stat.value}
          </p>
          <p className="text-white/80 text-[clamp(11px,1.1vw,16px)] font-medium">
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  )
}
