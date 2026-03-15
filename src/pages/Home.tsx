import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Trophy, Users, CheckCircle2 } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Practice Exams. <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Improve Faster.
            </span> <br />
            Succeed Confidently.
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
            The ultimate study platform for Ethiopian high school students. 
            Access thousands of past exam questions and mock tests.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/grades" className="glass-button-primary text-lg px-8">
              Start Practicing
            </Link>
            <Link to="/about" className="glass-button-outline text-lg px-8">
              Learn More
            </Link>
          </div>
        </motion.div>
        
        {/* Background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Past Papers', value: '10+ Years' },
          { icon: GraduationCap, label: 'Practice Questions', value: '400,000+' },
          { icon: Trophy, label: 'Subjects', value: '12' },
          { icon: Users, label: 'Active Students', value: '50,000+' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <stat.icon className="w-8 h-8 mx-auto mb-4 text-secondary" />
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-white/50">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Subjects Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-10 text-center">Available Subjects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English',
            'Civics', 'Economics', 'History', 'Geography', 'Aptitude'
          ].map((subject, i) => (
            <div key={i} className="glass-card p-4 flex items-center gap-3 hover:bg-white/20 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">{subject}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">Why Choose Adari Institute?</h2>
          <div className="space-y-6">
            {[
              { title: 'Dynamic Quiz Engine', desc: 'Practice with randomized questions and instant feedback.' },
              { icon: BookOpen, title: 'Detailed Explanations', desc: 'Every question comes with a clear AI-powered explanation.' },
              { icon: Trophy, title: 'Progress Tracking', desc: 'Monitor your scores and identify areas for improvement.' },
              { icon: Users, title: 'Mobile Friendly', desc: 'Study anytime, anywhere on any device.' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-white/60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card aspect-square relative overflow-hidden">
          <img 
            src="https://picsum.photos/seed/study/800/800" 
            alt="Students studying" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="glass-card p-6">
              <p className="italic text-lg mb-4">"Adari Institute helped me score 600+ on my entrance exam. The practice questions are exactly like the real ones!"</p>
              <div className="font-bold">— Abebe K., Grade 12 Student</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
