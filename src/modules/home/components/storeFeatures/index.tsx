'use client';

import { Truck, ShieldCheck, CreditCard, RefreshCw, Headphones, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const StoreFeatures = ({ locale }: { locale: string }) => {
    const isRTL = locale === "ar";

    const features = [
        {
            icon: <Truck size={32} />,
            title: isRTL ? "شحن سريع" : "Fast Shipping",
            description: isRTL ? "توصيل سريع خلال 1-3 أيام عمل" : "Get your order delivered in 1-3 business days"
        },
        {
            icon: <ShieldCheck size={32} />,
            title: isRTL ? "ضمان الجودة" : "Quality Guarantee",
            description: isRTL ? "منتجاتنا معتمدة وذات جودة عالية" : "Certified products with highest quality standards"
        },
        {
            icon: <CreditCard size={32} />,
            title: isRTL ? "دفع آمن" : "Secure Payment",
            description: isRTL ? "مدفوعات مشفرة وآمنة بنسبة 100%" : "100% secure and encrypted payments"
        },
        {
            icon: <RefreshCw size={32} />,
            title: isRTL ? "إرجاع سهل" : "Easy Returns",
            description: isRTL ? "سياسة إرجاع لمدة 14 يومًا" : "14-day hassle-free return policy"
        },
        {
            icon: <Headphones size={32} />,
            title: isRTL ? "دعم 24/7" : "24/7 Support",
            description: isRTL ? "فريق دعم متاح على مدار الساعة" : "Our support team is always available"
        },
        {
            icon: <Gift size={32} />,
            title: isRTL ? "هدايا مجانية" : "Free Gifts",
            description: isRTL ? "هدايا مجانية مع طلبات محددة" : "Special free gifts with select orders"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 content-container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
                        >
                            <div className="p-3 mb-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default StoreFeatures;