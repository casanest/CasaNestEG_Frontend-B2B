"use client"

import { motion } from "framer-motion"
import { Sparkles, Users, TrendingUp, Home } from "lucide-react"

const primary = "#043364"

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-white text-gray-800 px-4 sm:px-8 py-16 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 flex items-center justify-center gap-2" style={{ color: primary }}>
          <Sparkles size={36} color={primary} /> About LA CASA
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          We blend comfort, design, and practicality into lifestyle products that elevate every home.
        </p>
      </motion.div>

      {/* Who We Are & Mission */}
      <section className="mt-16 grid gap-8 md:grid-cols-2 max-w-6xl w-full">
        {[
          {
            title: "Who We Are",
            desc:
              "Founded with a passion for lifestyle innovation, LA CASA brings you hand-picked products that add value and elegance to your daily life.",
          },
          {
            title: "Our Mission",
            desc:
              "To create delightful experiences through smart, functional, and beautiful home solutions tailored to modern living.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl shadow-md p-6 sm:p-8"
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
      >
        <h3 className="text-2xl font-semibold mb-2" style={{ color: primary }}>Our Vision</h3>
        <p className="text-gray-700 text-sm sm:text-base">
          To be the trusted companion in every home—where design meets function and elegance meets daily life.
        </p>
      </motion.div>

      {/* Values */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-24 max-w-6xl w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-10" style={{ color: primary }}>Our Core Values</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: <Home size={32} color={primary} />, title: "Quality", desc: "Premium materials and craftsmanship you can trust." },
            { icon: <TrendingUp size={32} color={primary} />, title: "Innovation", desc: "We stay ahead of trends to bring you cutting-edge design." },
            { icon: <Users size={32} color={primary} />, title: "Customer Focus", desc: "You’re at the heart of everything we do." },
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
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-24 max-w-6xl w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-10" style={{ color: primary }}>Meet the Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {["Alex", "Nora", "Youssef"].map((name, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 mb-4" />
              <h4 className="font-semibold text-lg" style={{ color: primary }}>{name}</h4>
              <p className="text-sm text-gray-500">Creative Director</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-24 max-w-5xl w-full grid grid-cols-1 sm:grid-cols-3 text-center gap-6"
      >
        {[
          { number: "10K+", label: "Happy Customers" },
          { number: "150+", label: "Products Available" },
          { number: "4.9/5", label: "Customer Rating" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#f0f5ff] p-6 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold" style={{ color: primary }}>{stat.number}</h3>
            <p className="text-gray-700">{stat.label}</p>
          </div>
        ))}
      </motion.section>
    </main>
  )
}
