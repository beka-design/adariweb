import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GRADES } from '../constants';
import { GraduationCap, ChevronRight } from 'lucide-react';

const Grades: React.FC = () => {
  const navigate = useNavigate();

  const handleGradeSelect = (grade: string) => {
    localStorage.setItem('selectedGrade', grade);
    navigate('/subjects');
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Select Your Grade</h2>
        <p className="text-white/60">Choose your current grade level to see available subjects and practice exams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GRADES.map((grade, i) => (
          <motion.button
            key={grade}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleGradeSelect(grade)}
            className="glass-card p-8 text-left group hover:bg-white/20 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{grade}</h3>
                <p className="text-white/50">National Exam Preparation</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Grades;
