import React from 'react';
import { motion } from 'motion/react';
import { Gavel, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Terms: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl font-bold mb-6 tracking-tight">Terms of Service</h1>
                <p className="text-xl text-white/70">
                    Last updated: March 15, 2026
                </p>
            </motion.div>

            <div className="space-y-12">
                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Info className="w-6 h-6 text-primary" />
                        1. Agreement to Terms
                    </h2>
                    <p className="text-white/70 leading-relaxed">
                        By accessing or using the Adari Institute platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, then you are prohibited from using the site and must discontinue use immediately.
                    </p>
                </section>

                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-secondary" />
                        2. User Accounts
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                        To access certain features of the platform, you must register for an account. You agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-white/70">
                        <li>Provide accurate and complete information.</li>
                        <li>Maintain the security of your password.</li>
                        <li>Promptly update your account information if it changes.</li>
                        <li>Be responsible for all activities that occur under your account.</li>
                    </ul>
                </section>

                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Gavel className="w-6 h-6 text-emerald-500" />
                        3. Intellectual Property Rights
                    </h2>
                    <p className="text-white/70 leading-relaxed">
                        Unless otherwise indicated, the platform and its entire contents (including questions, explanations, graphics, and code) are the property of Adari Institute and are protected by copyright and other intellectual property laws. You are granted a limited, non-exclusive license to access the content for personal, non-commercial use.
                    </p>
                </section>

                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-primary" />
                        4. Prohibited Activities
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                        You may not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-white/70">
                        <li>Copy, distribute, or disclose any part of the platform in any medium.</li>
                        <li>Use any automated system (robots, spiders, etc.) to access the platform.</li>
                        <li>Attempt to interfere with the proper working of the platform.</li>
                        <li>Use the platform for any commercial solicitation purposes.</li>
                        <li>Share your account credentials with others.</li>
                    </ul>
                </section>

                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Info className="w-6 h-6 text-secondary" />
                        5. Subscriptions and Payments
                    </h2>
                    <p className="text-white/70 leading-relaxed">
                        Certain features require a paid subscription. All payments are processed through verified methods. Subscriptions are for the current academic year and are non-refundable once the verification process is complete and access is granted.
                    </p>
                </section>

                <section className="text-center py-8">
                    <p className="text-white/50">
                        For any questions regarding these terms, please contact us at <span className="text-primary">legal@adari.edu.et</span>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
