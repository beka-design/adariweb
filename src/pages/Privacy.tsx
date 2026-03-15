import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl font-bold mb-6 tracking-tight">Privacy Policy</h1>
                <p className="text-xl text-white/70">
                    Last updated: March 15, 2026
                </p>
            </motion.div>

            <div className="space-y-12">
                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Shield className="w-6 h-6 text-primary" />
                        1. Introduction
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                        At Adari Institute, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                    </p>
                    <p className="text-white/70 leading-relaxed">
                        Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                    </p>
                </section>

                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Eye className="w-6 h-6 text-secondary" />
                        2. Information We Collect
                    </h2>
                    <div className="space-y-4">
                        <h3 className="font-bold text-white">Personal Data</h3>
                        <p className="text-white/70">
                            We collect personally identifiable information, such as your name, email address, and grade level, that you voluntarily give to us when you register with the site.
                        </p>
                        <h3 className="font-bold text-white">Usage Data</h3>
                        <p className="text-white/70">
                            We collect information about your interactions with our platform, including quiz scores, subjects practiced, and time spent on the platform to help improve our services.
                        </p>
                    </div>
                </section>

                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Lock className="w-6 h-6 text-emerald-500" />
                        3. How We Use Your Information
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-white/70">
                        <li>To create and manage your account.</li>
                        <li>To provide personalized practice materials.</li>
                        <li>To process your payments and subscriptions.</li>
                        <li>To send you administrative information and updates.</li>
                        <li>To improve our platform and develop new features.</li>
                        <li>To protect against fraud and unauthorized access.</li>
                    </ul>
                </section>

                <section className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <FileText className="w-6 h-6 text-primary" />
                        4. Data Security
                    </h2>
                    <p className="text-white/70 leading-relaxed">
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                    </p>
                </section>

                <section className="text-center py-8">
                    <p className="text-white/50">
                        If you have questions about this Privacy Policy, please contact us at <span className="text-primary">privacy@adari.edu.et</span>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
