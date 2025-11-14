'use client';

import { Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const PromotionBanner = ({ locale }: { locale: string }) => {
    const isRTL = locale === "ar";
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [mounted, setMounted] = useState(false);

    // Set a fixed end date (e.g., end of year sale)
    const SALE_END_DATE = new Date('2025-12-31T23:59:59');

    // Calculate time left
    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = +SALE_END_DATE - +now;

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    useEffect(() => {
        setMounted(true);
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <section className="bg-gradient-to-tl from-gray-500 to-[#022a55] text-white py-6 sm:py-8" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4 text-center md:text-left justify-center md:justify-start">
                            <div className="p-3 bg-white/20 rounded-full">
                                <Zap size={24} className="text-white-300" />
                            </div>
                            <div className={`flex flex-col gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                                    {isRTL ? "عرض محدود الوقت!" : "Limited Time Offer!"}
                                </h2>
                                <p className="text-xs sm:text-sm md:text-base opacity-90">
                                    {isRTL ? "خصم حتى 40% على جميع المنتجات المختارة" : "Up to 40% off on all selected products"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const countdownItems = [
        { value: timeLeft.days, label: isRTL ? "يوم" : "Days" },
        { value: timeLeft.hours, label: isRTL ? "ساعة" : "Hours" },
        { value: timeLeft.minutes, label: isRTL ? "دقيقة" : "Minutes" },
        { value: timeLeft.seconds, label: isRTL ? "ثانية" : "Seconds" }
    ];

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#022a55] to-gray-700 text-white py-6 sm:py-8" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between"
                >
                    {/* Promo Text */}
                    <div className="flex items-center gap-4 text-center md:text-left justify-center md:justify-start flex-1">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.1, 1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                            className="p-3 bg-white/30 rounded-full backdrop-blur-sm shadow-lg"
                        >
                            <Zap size={28} className="text-white-300" fill="currentColor" />
                        </motion.div>
                        <div className={`flex flex-col gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <motion.h2
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold"
                            >
                                {isRTL ? "🎉 عرض نهاية العام!" : "🎉 End of Year Sale!"}
                            </motion.h2>
                            <p className="text-xs sm:text-sm md:text-base opacity-90">
                                {isRTL ? "خصم حتى 40% على جميع المنتجات المختارة" : "Up to 40% off on all selected products"}
                            </p>
                        </div>
                    </div>

                    {/* Countdown */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                            <Clock size={22} className="text-white-300" />
                            <div className={`flex gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {countdownItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <motion.div
                                            key={item.value}
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-lg min-w-[45px] sm:min-w-[55px] text-center border border-white/20 shadow-md"
                                        >
                                            <span className="font-mono font-bold text-lg sm:text-xl md:text-2xl">
                                                {item.value.toString().padStart(2, '0')}
                                            </span>
                                        </motion.div>
                                        <span className="text-[10px] sm:text-xs mt-1.5 opacity-80 font-medium">
                                            {item.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex justify-center md:justify-end flex-1">
                        <LocalizedClientLink
                            href={`/store`}
                            aria-label={isRTL ? "تسوق الآن" : "Shop Now"}
                            // whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(255,255,255,0.3)" }}
                            // whileTap={{ scale: 0.95 }}
                            className="relative px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-white to-gray-400 text-[#043364] font-bold rounded-full shadow-xl hover:shadow-2xl transition-all text-sm sm:text-base overflow-hidden group"
                        >
                            {/* <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(255,255,255,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className="relative px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-white to-gray-400 text-[#043364] font-bold rounded-full shadow-xl hover:shadow-2xl transition-all text-sm sm:text-base overflow-hidden group"
                            onClick={() => window.location.href = `/${locale}/store`}
                            aria-label={isRTL ? "تسوق الآن" : "Shop Now"}
                        > */}
                            <span className="relative z-10 flex items-center gap-2">
                                {isRTL ? "تسوق الآن 🛍️" : "🛍️ Shop Now"}
                            </span>
                            {/* <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white to-gray-400"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            /> */}
                            {/* </motion.button> */}
                        </LocalizedClientLink>
                    </div>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-6 h-1 bg-white/20 rounded-full overflow-hidden"
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-white via-gray-300 to-white"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ width: '50%' }}
                    />
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes delay-1000 {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.15; }
                }
                .delay-1000 {
                    animation: delay-1000 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default PromotionBanner;