import { satoshiStyle, caveatStyle, type Props } from "./styles"
import type { Banner } from "@lib/data/banners"

type OwnProps = Props & {
  banners: Banner[]
}

export default function OurClients({ isRTL, banners }: OwnProps) {
  if (!banners || banners.length === 0) return null

  const mid = Math.ceil(banners.length / 2)
  const row1 = banners.slice(0, mid)
  const row2 = banners.slice(mid)
  const row1Doubled = [...row1, ...row1]
  const row2Doubled = [...row2, ...row2]

  const renderMarqueeItem = (banner: Banner, idx: number) => (
    <div
      key={`${banner.id}-${idx}`}
      className="flex shrink-0 h-[clamp(100px,11vw,170px)] w-[clamp(200px,22vw,340px)] items-center justify-center mx-[clamp(5px,0.75vw,10px)]"
    >
      <img
        alt="Client logo"
        src={banner.image_url}
        className="max-h-[clamp(65px,8vw,130px)] max-w-[clamp(150px,20vw,280px)] object-contain"
      />
    </div>
  )

  return (
    <section
      className="bg-white flex flex-col gap-6 lg:gap-0 items-center justify-center py-11 lg:py-[clamp(28px,5vw,80px)] relative w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-6 lg:gap-[clamp(24px,4vw,60px)] items-center justify-center w-full">
      <div className="flex flex-col gap-1.5 lg:gap-[clamp(8px,1vw,16px)] items-center text-center max-w-[900px]">
        <div className="flex flex-col gap-1.5 lg:gap-[clamp(6px,0.6vw,8px)] items-center">
          <p className="text-[#17284a] text-[32px] lg:text-[clamp(28px,2.5vw,40px)]" style={caveatStyle}>
            {isRTL ? "عملاؤنا" : "Our Clients"}
          </p>
          <p className="text-black text-[24px] lg:text-[clamp(24px,2.8vw,40px)]" style={{ ...satoshiStyle, fontWeight: 700 }}>
            {isRTL ? "فرق تبني للمستقبل" : "Teams That Build for the Future"}
          </p>
        </div>
        <p className="text-[#5d5d61] lg:text-black text-[14px] lg:text-[clamp(14px,1.6vw,24px)] lg:opacity-80" style={satoshiStyle}>
          {isRTL
            ? "نعمل مع مؤسسات عبر قطاعات الأعمال والتعليم والضيافة والبيئات المؤسسية لتقديم مساحات تؤدي بأفضل شكل."
            : "We work with organizations across business, education, hospitality, and institutional environments to deliver spaces that perform."}
        </p>
      </div>
      </div>
      {/* Mobile: two infinite auto-scrolling marquee bars in opposite directions */}
      <div className="flex lg:hidden flex-col gap-[16px] w-full">
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[40px] bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[40px] bg-gradient-to-l from-white to-transparent" />
          <div className="flex w-max animate-scroll-left" dir="ltr">
            {row1Doubled.map((banner, idx) => (
              <div
                key={`${banner.id}-${idx}`}
                className="flex shrink-0 h-[110px] w-[190px] items-center justify-center mx-[10px]"
              >
                <img
                  alt="Client logo"
                  src={banner.image_url}
                  className="max-h-[72px] max-w-[160px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[40px] bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[40px] bg-gradient-to-l from-white to-transparent" />
          <div className="flex w-max animate-scroll-right" dir="ltr">
            {row2Doubled.map((banner, idx) => (
              <div
                key={`${banner.id}-${idx}`}
                className="flex shrink-0 h-[110px] w-[190px] items-center justify-center mx-[10px]"
              >
                <img
                  alt="Client logo"
                  src={banner.image_url}
                  className="max-h-[72px] max-w-[160px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Desktop: two infinite auto-scrolling marquee bars in opposite directions */}
      <div className="hidden lg:flex flex-col gap-[clamp(24px,3vw,48px)] w-full mt-[30px]">
        {/* Row 1 - scrolls left */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[120px] bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[120px] bg-gradient-to-l from-white to-transparent" />
          <div className="flex w-max animate-scroll-left" dir="ltr">
            {row1Doubled.map((banner, idx) => renderMarqueeItem(banner, idx))}
          </div>
        </div>
        {/* Row 2 - scrolls right */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[120px] bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[120px] bg-gradient-to-l from-white to-transparent" />
          <div className="flex w-max animate-scroll-right" dir="ltr">
            {row2Doubled.map((banner, idx) => renderMarqueeItem(banner, idx))}
          </div>
        </div>
      </div>
    </section>
  )
}
