"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const CallToActionBanner = ({ locale }: { locale: string }) => {
    const isRTL = locale === "ar";

    return (
        <section
            dir={isRTL ? "rtl" : "ltr"}
            className="relative w-full bg-gradient-to-tr from-teal-500 to-[#043364] text-white py-12 px-4 md:px-16 md:rounded-3xl my-10 overflow-hidden"
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <div className="text-center md:text-left space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                        {isRTL
                            ? "💥 تسوق الآن واحصل على خصم 20٪ على طلبك الأول!"
                            : "💥 Shop Now & Get 20% Off Your First Order!"}
                    </h2>
                    <p className="text-lg text-white/90 max-w-xl">
                        {isRTL
                            ? "انضم إلينا اليوم واستمتع بعروض حصرية على أفضل الأجهزة المنزلية."
                            : "Join us today and enjoy exclusive offers on the best home appliances."}
                    </p>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} className="shrink-0">
                    <Link href="/signup" passHref>
                        <span className="inline-block bg-white text-[#043364] font-bold px-8 py-3 rounded-full shadow-lg transition duration-300 hover:bg-gray-100 cursor-pointer text-lg">
                            {isRTL ? "سجل الآن" : "Join Now"}
                        </span>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default CallToActionBanner;
