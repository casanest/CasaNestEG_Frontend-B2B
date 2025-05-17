'use client';

import { Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const PromotionBanner = ({ locale }: { locale: string }) => {
    const isRTL = locale === "ar";
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Set the end date for the promotion (3 days from now)
    const calculateTimeLeft = () => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
        const difference = +endDate - +new Date();

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
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const countdownItems = [
        { value: timeLeft.days, label: isRTL ? "أيام" : "Days" },
        { value: timeLeft.hours, label: isRTL ? "ساعات" : "Hours" },
        { value: timeLeft.minutes, label: isRTL ? "دقائق" : "Minutes" },
        { value: timeLeft.seconds, label: isRTL ? "ثواني" : "Seconds" }
    ];

    return (
        <section className="bg-gradient-to-r from-[#048364] to-[#043364] text-white py-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="md:content-container container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    {/* Promotion Text */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            <Zap size={28} className="text-yellow-300" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold">
                                {isRTL ? "عرض محدود الوقت!" : "Limited Time Offer!"}
                            </h2>
                            <p className="text-sm md:text-base opacity-90">
                                {isRTL ?
                                    "خصم حتى 40% على جميع المنتجات المختارة" :
                                    "Up to 40% off on all selected products"}
                            </p>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Clock size={24} className="opacity-80" />
                        <div className="flex gap-2 md:gap-4">
                            {countdownItems.map((item, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="bg-white/20 px-3 py-1 rounded-md min-w-[50px] text-center">
                                        <span className="font-mono font-bold text-lg">
                                            {item.value.toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span className="text-xs mt-1 opacity-80">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    {/* <div className="hidden md:flex items-center gap-4">
                        <Zap size={24} className="opacity-80" />
                        <p className="text-sm md:text-base opacity-90">
                            {isRTL ?
                                "تسوق الآن قبل فوات الأوان!" :
                                "Shop now before it's too late!"}
                        </p>
                    </div> */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-white text-[#043364] font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                        onClick={() => window.location.href = '/store'}
                        aria-label={isRTL ? "تسوق الآن" : "Shop Now"}
                    >
                        {isRTL ? "تسوق الآن" : "Shop Now"}
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default PromotionBanner;