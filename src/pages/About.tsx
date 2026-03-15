import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Target, Users, Award } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl font-bold mb-6 tracking-tight">About Adari Institute</h1>
                <p className="text-xl text-white/70">
                    We are dedicated to revolutionizing how Ethiopian students prepare for national exams.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Target className="w-6 h-6 text-primary" />
                        Our Mission
                    </h2>
                    <p className="text-white/60 leading-relaxed">
                        To provide every Ethiopian student with high-quality, accessible, and affordable exam preparation tools. We believe that with the right resources, every student can achieve their academic dreams.
                    </p>
                </div>
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-secondary" />
                        Our Vision
                    </h2>
                    <p className="text-white/60 leading-relaxed">
                        To become the leading digital education platform in East Africa, known for excellence in content and innovative learning technologies.
                    </p>
                </div>
            </div>

            <section className="space-y-12">
                <h2 className="text-3xl font-bold text-center">Why We Started</h2>
                <div className="glass-card p-8">
                    <p className="text-white/70 mb-6">
                        Adari Institute was founded by a group of educators and technologists who noticed a significant gap in the availability of practice materials for the Ethiopian Secondary School Leaving Certificate Examination (ESSLCE).
                    </p>
                    <p className="text-white/70">
                        We realized that many students struggle not because they lack the intelligence, but because they lack exposure to the types of questions and the time management skills required for national exams. Our platform is designed to bridge that gap.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: Users, title: 'Student Focused', desc: 'Everything we build is with the student experience in mind.' },
                        { icon: Award, title: 'Quality Content', desc: 'Our questions are curated by experienced subject matter experts.' },
                        { icon: BookOpen, title: 'Always Improving', desc: 'We use AI and data to constantly refine our practice materials.' },
                    ].map((item, i) => (
                        <div key={i} className="glass-card p-6 text-center">
                            <item.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                            <h3 className="font-bold mb-2">{item.title}</h3>
                            <p className="text-sm text-white/50">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <section className="py-12">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        {[
                            { step: '01', title: 'Register', desc: 'Create your free account and select your grade level.' },
                            { step: '02', title: 'Choose Subject', desc: 'Pick from a wide range of national exam subjects.' },
                            { step: '03', title: 'Practice', desc: 'Take timed quizzes with real past exam questions.' },
                            { step: '04', title: 'Analyze', desc: 'Review detailed explanations and track your progress.' },
                        ].map((item, i) => (
                            <div key={i} className="relative p-6 glass-card overflow-hidden group">
                                <div className="text-6xl font-bold text-white/5 absolute -right-2 -top-2 group-hover:text-primary/10 transition-colors">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2 relative z-10">{item.title}</h3>
                                <p className="text-sm text-white/50 relative z-10">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass-card p-12 text-center bg-primary/5">
                    <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
                    <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who are already using Adari Institute to secure their future.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="glass-button-primary px-8">
                            Create Free Account
                        </Link>
                    </div>
                </section>
            </section>
        </div>
    );
};

export default About;
