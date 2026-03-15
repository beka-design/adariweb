import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="max-w-5xl mx-auto py-12">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold mb-6 tracking-tight">Get in Touch</h1>
                <p className="text-xl text-white/70">
                    Have questions or feedback? We'd love to hear from you.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-sm text-white/50 uppercase tracking-wider font-bold">Email</div>
                                    <div className="text-lg">info@adari.edu.et</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <div className="text-sm text-white/50 uppercase tracking-wider font-bold">Phone</div>
                                    <div className="text-lg">+251 901 705 907</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="text-sm text-white/50 uppercase tracking-wider font-bold">Location</div>
                                    <div className="text-lg">Addis Ababa, Ethiopia</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Support Hours
                        </h3>
                        <p className="text-white/60">
                            Monday - Friday: 8:30 AM - 5:30 PM<br />
                            Saturday: 9:00 AM - 1:00 PM<br />
                            Sunday: Closed
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {submitted ? (
                        <div className="glass-card p-12 text-center h-full flex flex-col justify-center items-center">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                <Send className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                            <p className="text-white/60">
                                Thank you for reaching out. We'll get back to you as soon as possible.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-8 glass-button-outline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                            <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/70">Full Name</label>
                                    <input type="text" className="glass-input" placeholder="Your Name" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/70">Email Address</label>
                                    <input type="email" className="glass-input" placeholder="you@example.com" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/70">Subject</label>
                                    <input type="text" className="glass-input" placeholder="How can we help?" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/70">Message</label>
                                    <textarea className="glass-input min-h-[150px] py-4" placeholder="Your message..." required></textarea>
                                </div>
                            </div>
                            <button type="submit" className="glass-button-primary w-full py-4 flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
