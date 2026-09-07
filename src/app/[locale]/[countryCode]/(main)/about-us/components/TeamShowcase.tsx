import { satoshiStyle, type Props } from "./styles"

const teamMembers = [
  {
    image: "/about-us/team-1.webp",
    name: "Sherif El-Ganzouri",
    nameAr: "شريف الجنزوري",
    role: "Co-Founder & Managing Director",
    roleAr: "المؤسس المشارك والمدير العام",
  },
  {
    image: "/about-us/team-2.webp",
    name: "Sherif El-Ganzouri",
    nameAr: "شريف الجنزوري",
    role: "Co-Founder & Managing Director",
    roleAr: "المؤسس المشارك والمدير العام",
  },
  {
    image: "/about-us/team-3.webp",
    name: "Sherif El-Ganzouri",
    nameAr: "شريف الجنزوري",
    role: "Co-Founder & Managing Director",
    roleAr: "المؤسس المشارك والمدير العام",
  },
]

export default function TeamShowcase({ isRTL }: Props) {
  return (
    <section
      className="bg-[#faf8f5] flex flex-col gap-6 lg:gap-[clamp(24px,3.5vw,48px)] items-start py-11 lg:py-[clamp(60px,10vw,160px)] relative w-full lg:min-h-screen lg:justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="content-container flex flex-col gap-6 lg:gap-[clamp(32px,5vw,72px)] items-start w-full">
      <div className="flex flex-col gap-2 lg:gap-[clamp(8px,0.8vw,12px)] items-start">
        <h2 className="text-[#17284a] text-[24px] lg:text-[clamp(24px,2.8vw,40px)]" style={{ ...satoshiStyle, fontWeight: 700 }}>
          {isRTL ? "تعرّف على قيادتنا" : "Meet Our Leadership"}
        </h2>
        <p className="text-[#707176] text-[14px] lg:text-[clamp(13px,1.3vw,18px)]" style={satoshiStyle}>
          {isRTL
            ? "خبراء الشراء والمهندسون والمحترفون التقنيون الذين يقودون أقسامنا."
            : "The procurement experts, architects, and technical professionals leading our divisions."}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-[2vw] lg:justify-center items-start lg:items-center w-full">
        {teamMembers.map((member, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 h-[387px] items-start relative w-full lg:w-[clamp(300px,32vw,435px)]"
          >
            <div className="h-[387px] relative rounded-xl w-full overflow-hidden">
              <img
                alt={member.name}
                src={member.image}
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute bg-white bottom-3 left-[3%] right-[3%] lg:left-1/2 lg:right-auto lg:-translate-x-1/2 flex flex-col gap-1 items-start px-4 py-3 rounded-xl lg:w-[clamp(300px,30vw,410px)] lg:max-w-[calc(100%-20px)]">
              <p className="text-[#17284a] text-[20px]" style={{ ...satoshiStyle, fontWeight: 700 }}>
                {isRTL ? member.nameAr : member.name}
              </p>
              <p className="text-[#707176] text-[16px]" style={satoshiStyle}>
                {isRTL ? member.roleAr : member.role}
              </p>
              <p className="text-[#3a4f7a] text-[16px]" style={{ ...satoshiStyle, fontWeight: 500 }}>
                example@gmail.com
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
