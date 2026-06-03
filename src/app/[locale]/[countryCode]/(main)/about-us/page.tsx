"use client"

import { motion } from "framer-motion"
import { Sparkles, Users, TrendingUp, Home } from "lucide-react"
import { useLocale } from "next-intl";

const primary = "#043364"

export default function AboutUs() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  return (
    <main className="min-h-screen bg-white text-gray-800 px-4 sm:px-8 py-16 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 flex items-center justify-center gap-2" style={{ color: primary }}>
          <Sparkles size={36} color={primary} /> {locale === "ar" ? "من نحن | كازانيست" : "About Us | CasaNest"} <Sparkles size={36} color={primary} />
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {locale === "ar"
            ? "إرث من الثقة.. ورؤية تتخطى الحدود"
            : "We blend comfort, design, and practicality into lifestyle products that elevate every home."}
        </p>
      </motion.div>

      {/* Who We Are & Mission */}
      <section className="mt-16 grid gap-8 md:grid-cols-2 max-w-6xl w-full">
        {[
          {
            title: locale === "ar" ? "من نحن" : "Who We Are",
            desc: locale === "ar"
              ? "منذ عام 2001، انطلقت مسيرتنا كركيزة اساسية في قطاع التوريدات، لكبرى مؤسسات الدولة وقطاعاتها الحيوية، سواء في القطاع الحكومي او الخاص. نجحنا على مدار اكثر من عقدين في ان نكون الشريك لتلك المؤسسات في توريدات الاثاث وكل ما يلزم من اجهزه كهربائيه والكترونيه وغيرها."
              : "We are a team of designers and engineers dedicated to creating innovative home products that blend beauty and functionality.",
          },
          {
            title: locale === "ar" ? "امتداد الجودة" : "Our Mission",
            desc:
              locale === "ar"
                ? "بعد سنوات من النجاح في تجهيز تلك المؤسسات، قررنا في كازانيست نقل هذه الخبرة العريقة وتلك المعايير الاحترافية الى نطاق اوسع. لم نعد نكتفي بتجهيز المقرات فحسب، بل قررنا ان نصل بخدماتنا الى الافراد والعاملين داخل هذه القطاعات، لنمنحهم فرصه الحصول على خدماتنا بما يناسب احتياجاتهم."
                : "To provide high-quality home products with innovative designs that meet our customers' needs and add a touch of elegance to their homes.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`bg-gray-50 rounded-3xl shadow-md p-6 sm:p-8`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <h2 className="text-2xl font-bold mb-3" style={{ color: primary }}>{item.title}</h2>
            <p className="text-gray-700 text-sm sm:text-base">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Vision */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-20 max-w-3xl bg-[#f0f5ff] border border-[#cddff9] rounded-3xl p-8 sm:p-10 text-center shadow-lg"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h3 className="text-2xl font-semibold mb-2" style={{ color: primary }}>{locale === "ar" ? "تغطية شاملة.. وحلول متكاملة" : "Our Vision"}</h3>
        <p className="text-gray-700 text-sm sm:text-base">
          {locale === "ar"
            ? "كل ما يخص بيتك ومكتبك حسب الميزانيه المخصصه في مكان واحد، لاننا نؤمن بان البيع الحقيقي هو كيفيه الوصول لمتطلبات العميل طبقا للميزانيه المخصصه لتلك الاحتياجات."
            : "To be the first choice in the world of home products by offering innovative designs and high quality."}
        </p>
      </motion.div>

      {/* Values */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-24 max-w-6xl w-full"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h2 className="text-3xl font-bold text-center mb-10" style={{ color: primary }}>{locale === "ar" ? "قيمنا" : "Our Core Values"}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: <Home size={32} color={primary} />, title: locale === "ar" ? "جودة عالية" : "High Quality", desc: locale === "ar" ? "نحن نؤمن بأن الجودة هي أساس كل منتج." : "We believe quality is the foundation of every product." },
            { icon: <TrendingUp size={32} color={primary} />, title: locale === "ar" ? "الابتكار" : "Innovation", desc: locale === "ar" ? "نسعى دائمًا لتقديم تصاميم جديدة ومبتكرة." : "We always strive to offer new and innovative designs." },
            { icon: <Sparkles size={32} color={primary} />, title: locale === "ar" ? "الاستدامة" : "Sustainability", desc: locale === "ar" ? "نلتزم بتقديم منتجات صديقة للبيئة." : "We are committed to providing eco-friendly products." },
            { icon: <Users size={32} color={primary} />, title: locale === "ar" ? "العمل الجماعي" : "Teamwork", desc: locale === "ar" ? "نؤمن بقوة العمل الجماعي لتحقيق أهدافنا." : "We believe in the power of teamwork to achieve our goals." },
            { icon: <Sparkles size={32} color={primary} />, title: locale === "ar" ? "الصحة والاستقامة" : "Honesty and Integrity", desc: locale === "ar" ? "نحن نؤمن بأهمية الصدق والنزاهة في كل ما نقوم به." : "We believe in the importance of honesty and integrity in everything we do." },
            { icon: <Users size={32} color={primary} />, title: locale === "ar" ? "المؤسسة" : "The Heart", desc: locale === "ar" ? "نحن نؤمن بأن كل منتج يحمل لمسة من القلب." : "We believe that every product carries a touch of heart." },
          ].map((val, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex justify-center mb-3">{val.icon}</div>
              <h4 className="font-semibold text-lg mb-2" style={{ color: primary }}>{val.title}</h4>
              <p className="text-gray-600 text-sm">{val.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Meet the Team */}
      {/* <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        dir={isRTL ? "rtl" : "ltr"}
        className="mt-24 max-w-6xl w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-10" style={{ color: primary }}>
          {locale === "ar" ? "أعضاء الفريق" : "Meet the Team"}
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(locale === "ar"
            ? ["أليكس", "نورا", "يوسف"]
            : ["Alex", "Nora", "Youssef"]
          ).map((name, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 mb-4" />
              <h4 className="font-semibold text-lg" style={{ color: primary }}>{name}</h4>
              <p className="text-sm text-gray-500">
                {locale === "ar" ? "المسمى الوظيفي" : "Job Title"}
              </p>
            </div>
          ))}
        </div>

      </motion.section> */}

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-24 max-w-5xl w-full grid grid-cols-1 sm:grid-cols-3 text-center gap-6"
      >
        {(locale === "ar"
          ? [
            {
              number: "10K+",
              label: "عملاء سعداء",
            },
            {
              number: "500+",
              label: "منتجات متاحة",
            },
            {
              number: "4.9/5",
              label: "تقييم العملاء",
            }
          ]
          : [
            { number: "10K+", label: "Happy Customers" },
            { number: "500+", label: "Products Available" },
            { number: "4.9/5", label: "Customer Rating" },
          ]
        ).map((stat, i) => (
          <div key={i} className="bg-[#f0f5ff] p-6 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold" style={{ color: primary }}>{stat.number}</h3>
            <p className="text-gray-700">{stat.label}</p>
          </div>
        ))}
      </motion.section>
    </main>
  )
}
