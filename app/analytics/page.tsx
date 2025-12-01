'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, FileText, Clock, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
    const features = [
        {
            icon: TrendingUp,
            title: 'Performance Metrics',
            description: 'Track student performance and progress over time'
        },
        {
            icon: Users,
            title: 'User Analytics',
            description: 'Detailed insights into user engagement and activity'
        },
        {
            icon: FileText,
            title: 'Assignment Reports',
            description: 'Comprehensive reports on assignment completion rates'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/20 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-emerald-100/60 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 md:p-12"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-50/60 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20"
                        >
                            <BarChart2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight"
                        >
                            Analytics Dashboard
                        </motion.h1>

                        {/* Subtitle with Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/80 backdrop-blur-sm rounded-full border border-emerald-200/60">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-semibold text-emerald-700">Coming Soon</span>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl"
                        >
                            We&apos;re working hard to bring you powerful analytics and insights. 
                            This feature is currently under development and will be available soon.
                        </motion.p>

                        {/* Features Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                        >
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                        className="p-5 rounded-xl bg-gradient-to-br from-white/80 to-emerald-50/30 border border-emerald-100/40 backdrop-blur-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-100/80">
                                                <Icon className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Timeline Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm rounded-xl border border-emerald-100/60"
                        >
                            <Clock className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-gray-700">
                                Expected Release: <span className="font-bold text-emerald-700">Q1 2026</span>
                            </span>
                        </motion.div>

                        {/* Decorative Dots Pattern */}
                        <div className="absolute bottom-8 right-8 opacity-[0.03] pointer-events-none">
                            <div className="grid grid-cols-8 gap-2">
                                {Array.from({ length: 32 }).map((_, i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-emerald-600"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Additional Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="mt-6 p-6 bg-white/60 backdrop-blur-lg border border-emerald-100/40 rounded-2xl shadow-sm"
                >
                    <p className="text-sm text-gray-600 text-center">
                        Want to be notified when Analytics is ready?{' '}
                        <button className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors">
                            Stay updated
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}