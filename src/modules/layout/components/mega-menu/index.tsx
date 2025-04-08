"use client"
import React, { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const categories = [
    {
        name: "Big Home Appliances",
        subCategories: [
            {
                name: "Washing Machines",
                href: "/store/washing-machines",
                imgSrc: "/logoLacasa.jpg",
                products: [
                    { name: "Front Load", href: "/store/washing-machines/front-load", imgSrc: "/logoLacasa.jpg" },
                    { name: "Top Load", href: "/store/washing-machines/top-load", imgSrc: "/logoLacasa.jpg" },
                ]
            },
            {
                name: "Dishwasher", href: "/store/dishwashers", imgSrc: "/logoLacasa.jpg",
                products: [
                    { name: "Built-in", href: "/store/dishwashers/built-in", imgSrc: "/logoLacasa.jpg" },
                    { name: "Freestanding", href: "/store/dishwashers/freestanding", imgSrc: "/logoLacasa.jpg" },
                ]
            },
            {
                name: "Cooker", href: "/store/cookers", imgSrc: "/logoLacasa.jpg",
                products: [
                    { name: "Built-in", href: "/store/cookers/built-in", imgSrc: "/logoLacasa.jpg" },
                    { name: "Freestanding", href: "/store/cookers/freestanding", imgSrc: "/logoLacasa.jpg" },
                ]
            },
            {
                name: "Water Dispenser", href: "/store/water-dispensers", imgSrc: "/logoLacasa.jpg",
                products: [
                    { name: "Hot & Cold", href: "/store/water-dispensers/hot-cold", imgSrc: "/logoLacasa.jpg" },
                    { name: "Cold Only", href: "/store/water-dispensers/cold-only", imgSrc: "/logoLacasa.jpg" },
                ]
            },
            { name: "Built-in Appliances", href: "/store/built-in", imgSrc: "/logoLacasa.jpg",
                products: [
                    { name: "Ovens", href: "/store/built-in/ovens", imgSrc: "/logoLacasa.jpg" },
                    { name: "Hobs", href: "/store/built-in/hobs", imgSrc: "/logoLacasa.jpg" },
                ]
             },
            { name: "Air Conditioners", href: "/store/ac", imgSrc: "/logoLacasa.jpg" },
            { name: "Refrigerator & Freezers", href: "/store/refrigerators", imgSrc: "/logoLacasa.jpg" },
        ],
    },
    {
        name: "Small Home Appliances",
        subCategories: [
            { name: "Cooker", href: "/store/cookers", imgSrc: "/logoLacasa.jpg",
                products: [
                    { name: "Electric", href: "/store/cookers/electric", imgSrc: "/logoLacasa.jpg" },
                    { name: "Gas", href: "/store/cookers/gas", imgSrc: "/logoLacasa.jpg" },
                    { name: "Stove", href: "/store/cookers/stove", imgSrc: "/logoLacasa.jpg" },
                    { name: "Induction", href: "/store/cookers/induction", imgSrc: "/logoLacasa.jpg" },
                    { name: "Microwave", href: "/store/cookers/microwave", imgSrc: "/logoLacasa.jpg" },
                    { name: "Toaster", href: "/store/cookers/toaster", imgSrc: "/logoLacasa.jpg" },
                    { name: "Built-in", href: "/store/cookers/built-in", imgSrc: "/logoLacasa.jpg" },
                    { name: "Freestanding", href: "/store/cookers/freestanding", imgSrc: "/logoLacasa.jpg" },
                ]
             },
            { name: "Water Dispenser", href: "/store/water-dispensers", imgSrc: "/logoLacasa.jpg",
                products: [
                    { name: "Hot & Cold", href: "/store/water-dispensers/hot-cold", imgSrc: "/logoLacasa.jpg" },
                    { name: "Cold Only", href: "/store/water-dispensers/cold-only", imgSrc: "/logoLacasa.jpg" },
                ]
             },
            { name: "Built-in Appliances", href: "/store/built-in", imgSrc: "/logoLacasa.jpg" },
            { name: "Air Conditioners", href: "/store/ac", imgSrc: "/logoLacasa.jpg" },
            { name: "Refrigerator & Freezers", href: "/store/refrigerators", imgSrc: "/logoLacasa.jpg" },
        ],
    },
    {
        name: "Kitchen Appliances",
        subCategories: [
            { name: "Cooker", href: "/store/cookers", imgSrc: "/logoLacasa.jpg" },
            { name: "Water Dispenser", href: "/store/water-dispensers", imgSrc: "/logoLacasa.jpg" },
            { name: "Built-in Appliances", href: "/store/built-in", imgSrc: "/logoLacasa.jpg" },
            { name: "Air Conditioners", href: "/store/ac", imgSrc: "/logoLacasa.jpg" },
            { name: "Refrigerator & Freezers", href: "/store/refrigerators", imgSrc: "/logoLacasa.jpg" },
        ],
    },
    {
        name: "Personal Care",
        subCategories: [
            { name: "Cooker", href: "/store/cookers", imgSrc: "/logoLacasa.jpg" },
            { name: "Water Dispenser", href: "/store/water-dispensers", imgSrc: "/logoLacasa.jpg" },
            { name: "Built-in Appliances", href: "/store/built-in", imgSrc: "/logoLacasa.jpg" },
            { name: "Air Conditioners", href: "/store/ac", imgSrc: "/logoLacasa.jpg" },
            { name: "Refrigerator & Freezers", href: "/store/refrigerators", imgSrc: "/logoLacasa.jpg" },
        ],
    },
    {
        name: "Home Entertainment",
        subCategories: [
            { name: "Cooker", href: "/store/cookers", imgSrc: "/logoLacasa.jpg" },
            { name: "Water Dispenser", href: "/store/water-dispensers", imgSrc: "/logoLacasa.jpg" },
            { name: "Built-in Appliances", href: "/store/built-in", imgSrc: "/logoLacasa.jpg" },
            { name: "Air Conditioners", href: "/store/ac", imgSrc: "/logoLacasa.jpg" },
            { name: "Refrigerator & Freezers", href: "/store/refrigerators", imgSrc: "/logoLacasa.jpg" },
        ],
    },
    {
        name: "Smart Home & Security",
        subCategories: [
            { name: "Cooker", href: "/store/cookers", imgSrc: "/logoLacasa.jpg" },
            { name: "Water Dispenser", href: "/store/water-dispensers", imgSrc: "/logoLacasa.jpg" },
            { name: "Built-in Appliances", href: "/store/built-in", imgSrc: "/logoLacasa.jpg" },
            { name: "Air Conditioners", href: "/store/ac", imgSrc: "/logoLacasa.jpg" },
            { name: "Refrigerator & Freezers", href: "/store/refrigerators", imgSrc: "/logoLacasa.jpg" },
        ],
    },
    {
        name: "Home & Living",
        subCategories: [
            { name: "Cooker", href: "/store/cookers", imgSrc: "/logoLacasa.jpg" },
            { name: "Water Dispenser", href: "/store/water-dispensers", imgSrc: "/logoLacasa.jpg" },
            { name: "Built-in Appliances", href: "/store/built-in", imgSrc: "/logoLacasa.jpg" },
            { name: "Air Conditioners", href: "/store/ac", imgSrc: "/logoLacasa.jpg" },
            { name: "Refrigerator & Freezers", href: "/store/refrigerators", imgSrc: "/logoLacasa.jpg" },
        ],
    },
    {
        name: "Outdoor & Garden",
        subCategories: [
            { name: "Cooker", href: "/store/cookers", imgSrc: "/logoLacasa.jpg" },
            { name: "Water Dispenser", href: "/store/water-dispensers", imgSrc: "/logoLacasa.jpg" },
            { name: "Built-in Appliances", href: "/store/built-in", imgSrc: "/logoLacasa.jpg" },
            { name: "Air Conditioners", href: "/store/ac", imgSrc: "/logoLacasa.jpg" },
            { name: "Refrigerator & Freezers", href: "/store/refrigerators", imgSrc: "/logoLacasa.jpg" },
        ],
    },
    {
        name: "Health & Fitness",
        subCategories: [
            { name: "Cooker", href: "/store/cookers", imgSrc: "/logoLacasa.jpg" },
            { name: "Water Dispenser", href: "/store/water-dispensers", imgSrc: "/logoLacasa.jpg" },
            { name: "Built-in Appliances", href: "/store/built-in", imgSrc: "/logoLacasa.jpg" },
            { name: "Air Conditioners", href: "/store/ac", imgSrc: "/logoLacasa.jpg" },
            { name: "Refrigerator & Freezers", href: "/store/refrigerators", imgSrc: "/logoLacasa.jpg" },
        ],
    },
    // Add other categories similarly...
]

export default function MegaMenu() {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    // Show only first 6 categories and add a "See More" link
    const visibleCategories = categories.slice(0, 6)

    return (
        <nav className="mega-menu hidden md:block w-full bg-white shadow-sm relative z-40">
            {/* Horizontal Navigation Bar */}
            <ul className="flex flex-wrap text-gray-700 font-medium py-4 px-6 gap-6 w-full">
                {visibleCategories.map((category, index) => (
                    <li
                        key={index}
                        onMouseEnter={() => setHoveredCategory(category.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        onClick={() => setHoveredCategory(category.name)}
                        className={`relative group cursor-pointer ${hoveredCategory === category.name ? 'bg-blue-100 rounded-md font-semibold text-lg text-[#043364] px-4 py-1' : ''}`}
                        role="menuitem"
                        aria-haspopup="true"
                        aria-expanded={hoveredCategory === category.name}
                    >
                        <span
                            className="text-[#043364] px-4 py-2 hover:font-semibold hover:text-lg transition-all duration-200 rounded-md "
                            tabIndex={0}
                        >
                            {category.name}
                        </span>

                        {/* Dropdown for hovered category */}
                        {hoveredCategory === category.name && (
                            <div className="absolute text-[#043364] left-0 top-full bg-white  rounded-bottom z-50 min-w-[1200px] max-w-full overflow-auto border  animate-fadeIn">
                                <div className="flex flex-col md:flex-row gap-4 p-6">
                                    {/* Subcategory Links with Images */}
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                                        {category.subCategories.map((sub, subIndex) => (
                                            <li key={subIndex} className="flex flex-col items-center text-center">
                                                <Image
                                                    src={sub.imgSrc}
                                                    alt={sub.name}
                                                    width={100}
                                                    height={100}
                                                    className="mb-2 rounded-lg object-cover"
                                                />
                                                <LocalizedClientLink
                                                    href={sub.href}
                                                    className="py-2 px-3 text-lg  hover:text-[#043364] rounded transition-colors duration-200 block"
                                                >
                                                    {sub.name}
                                                </LocalizedClientLink>

                                                {/* Display Products under subCategory */}
                                                {sub.products && (
                                                    <ul className="mt-2 space-y-2">
                                                        {sub.products.map((product, productIndex) => (
                                                            <li key={productIndex} className="text-gray-600">
                                                                <LocalizedClientLink
                                                                    href={product.href}
                                                                    className="text-sm text-gray-400 hover:underline hover:text-blue-600 rounded transition-colors duration-200 block"
                                                                >
                                                                    {product.name}
                                                                </LocalizedClientLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </li>
                ))}

                {/* "See More" link for additional categories */}
                {categories.length > 6 && (
                    <li className="relative group cursor-pointer">
                        <LocalizedClientLink
                            href="/categories"
                            className="text-[#043364] px-4 py-2 hover:font-semibold hover:text-lg transition-all duration-200 rounded-md hover:bg-blue-50"
                        >
                            See More Categories
                        </LocalizedClientLink>
                    </li>
                )}
            </ul>

            {/* Mobile Menu Toggle */}
            <div className="block md:hidden text-gray-700">
                <button onClick={toggleMenu} className="p-2 text-xl bg-blue-500 rounded-md text-white hover:bg-blue-600 focus:outline-none">
                    {isMenuOpen ? 'Close Menu' : 'Open Menu'}
                </button>

                {/* Mobile View Dropdown */}
                {isMenuOpen && (
                    <div className="absolute w-full bg-white shadow-lg z-50 top-full mt-2 p-4">
                        <ul>
                            {categories.map((category, index) => (
                                <li key={index} className="py-3 px-2">
                                    <span className="text-[#043364] text-lg cursor-pointer">
                                        {category.name}
                                    </span>
                                    <ul className="pl-4">
                                        {category.subCategories.map((sub, subIndex) => (
                                            <li key={subIndex}>
                                                <LocalizedClientLink
                                                    href={sub.href}
                                                    className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors duration-200 block"
                                                >
                                                    {sub.name}
                                                </LocalizedClientLink>

                                                {/* Display Products under subCategory */}
                                                {sub.products && (
                                                    <ul className="pl-4 mt-2">
                                                        {sub.products.map((product, productIndex) => (
                                                            <li key={productIndex}>
                                                                <LocalizedClientLink
                                                                    href={product.href}
                                                                    className="text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors duration-200 block"
                                                                >
                                                                    {product.name}
                                                                </LocalizedClientLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}
