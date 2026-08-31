import { satoshiStyle, caveatStyle, type Props } from "./styles"
import type { Banner } from "@lib/data/banners"

type OwnProps = Props & {
  banners: Banner[]
}

export default function OurClients({ isRTL, banners }: OwnProps) {
  if (!banners || banners.length === 0) return null

  const rows: Banner[][] = []
  for (let i = 0; i < banners.length; i += 5) {
    rows.push(banners.slice(i, i + 5))
  }

  return (
    <section
      className="bg-white flex flex-col gap-6 lg:gap-0 items-center justify-center py-11 lg:py-20 relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-6 lg:gap-[60px] items-center justify-center w-full">
      <div className="flex flex-col gap-1.5 lg:gap-4 items-center text-center max-w-[900px]">
        <div className="flex flex-col gap-1.5 lg:gap-2 items-center">
          <p className="text-[#17284a] text-[24px]" style={caveatStyle}>
            {isRTL ? "عملاؤنا" : "Our Clients"}
          </p>
          <p className="text-black text-[24px] lg:text-[40px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
            {isRTL ? "فرق تبني للمستقبل" : "Teams That Build for the Future"}
          </p>
        </div>
        <p className="text-[#5d5d61] lg:text-black text-[14px] lg:text-[24px] lg:opacity-80" style={satoshiStyle}>
          {isRTL
            ? "نعمل مع مؤسسات عبر قطاعات الأعمال والتعليم والضيافة والبيئات المؤسسية لتقديم مساحات تؤدي بأفضل شكل."
            : "We work with organizations across business, education, hospitality, and institutional environments to deliver spaces that perform."}
        </p>
      </div>
      {/* Mobile: flex-wrap grid, Desktop: rows of 5 */}
      <div className="flex flex-wrap gap-4 items-start w-full lg:hidden">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-[#f3f1ef] flex h-[60px] w-[calc(50%-8px)] items-center justify-center rounded-lg"
          >
            <img
              alt="Client logo"
              src={banner.image_url}
              className="max-h-[40px] max-w-[120px] object-contain"
            />
          </div>
        ))}
      </div>
      <div className="hidden lg:flex flex-col gap-5 items-start w-full">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-5 items-center w-full">
            {row.map((banner) => (
              <div
                key={banner.id}
                className="bg-[#f3f1ef] flex flex-1 h-[140px] items-center justify-center rounded-xl"
              >
                <img
                  alt="Client logo"
                  src={banner.image_url}
                  className="max-h-[100px] max-w-[220px] object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
