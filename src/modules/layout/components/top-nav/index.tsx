"use client"
import React, { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"

export default function TopNav() {
  const [lang, setLang] = useState("EN")

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "AR" : "EN"))
  }

  return (
    <div className="w-full text-xs md:text-sm text-gray-500 shadow-md bg-[#043364] top-0 z-[60] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between content-container mx-auto h-[36px]  ">
        {/* Left: Help + Social Icons */}
        <div className="flex items-center gap-3 text-white font-medium">
          <span className="truncate">
            Need help?{" "}
            <a href="tel:01095305663" className="hover:underline font-semibold">
              01095305663
            </a>
          </span>
          <div className="hidden md:flex items-center gap-2 text-base ml-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Right: Links + Language */}
        <div className="flex items-center gap-4 text-blue-500 font-medium">
          <div className="hidden md:flex items-center gap-4 text-white">
            <LocalizedClientLink
              href="/about"
              className="hover:text-blue-500 transition-colors duration-200 text-sm"
            >
              About Us
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/returns"
              className="hover:text-blue-500 transition-colors duration-200 text-sm"
            >
              Return Policy
            </LocalizedClientLink>
          </div>
          <button
            onClick={toggleLang}
            className="bg-white hover:bg-[#043364] hover:text-white text-[#043364] text-xs md:text-sm font-semibold py-0.5 px-3 rounded-full border border-blue-500 transition duration-300"
          >
            {lang === "EN" ? "عربي" : "EN"}
          </button>
        </div>
      </div>
    </div>
  )
}
