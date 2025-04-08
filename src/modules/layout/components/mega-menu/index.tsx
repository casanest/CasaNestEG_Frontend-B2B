"use client";
import React, { useState } from "react";

const categories = [
    {
        name: "Big Home Appliances",
        subCategories: [
            "Washing Machines",
            "Dishwasher",
            "Cooker",
            "Water Dispenser",
            "Built-in appliances",
            "Air Conditioners",
            "Refrigerator And Freezers",
        ],
    },
    {
        name: "Small Home Appliances",
        subCategories: [
            "Water Heaters",
            "Fans",
            "Iron",
            "Air Heater",
            "Ventilating Fan",
            "Vacuum",
            "Water Filters",
            "Insect Killer",
        ],
    },
    {
        name: "Kitchen Appliances",
        subCategories: [
            "Microwave Ovens",
            "Electric Ovens",
            "Electric Grill",
            "Hot Plate",
        ],
    },
    {
        name: "Breakfast Appliances",
        subCategories: [
            "Sandwich Maker",
            "Coffee and Espresso",
            "Boilers",
            "Fryer",
            "Juicers",
        ],
    },
    {
        name: "Chopping & Cutting Appliances",
        subCategories: [
            "Food Processor",
            "Electric Chopper",
            "Meat Grinder",
        ],
    },
    {
        name: "Mixing Appliances",
        subCategories: [
            "Electric Blender",
            "Stand Mixer",
            "Hand Blender",
            "Egg Mixer",
        ],
    },
    {
        name: "Specialized Appliances",
        subCategories: [
            "Cotton Candy Maker",
            "Yogurt Maker",
            "PopCorn Maker",
            "Sewing Machine",
        ],
    },
];

export default function MegaMenu() {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    return (
        <div className="mega-menu">
            <ul className="flex space-x-8 text-gray-700 font-medium py-1 px-4 bg-white shadow-md rounded-lg">
                {categories.map((category, index) => (
                    <li
                        key={index}
                        onMouseEnter={() => setHoveredCategory(category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className="relative group"
                    >
                        <span className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-500 transition-colors duration-300">{category.name}</span>
                        {hoveredCategory === category && (
                            <div className="absolute left-0 top-full bg-white shadow-2xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 ease-in-out">
                                <div className="flex p-6 space-x-8">
                                    <ul className="sub-categories space-y-2 w-64">
                                        {category.subCategories.map((subCategory, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className="py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors duration-200"
                                            >
                                                {subCategory}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="w-32 h-32 overflow-hidden rounded-lg shadow-lg">
                                        <img
                                            src="/lacasa.jpg"
                                            alt={category.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
