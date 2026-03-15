import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SUBJECTS_BY_GRADE } from '../constants';
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';

const Subjects: React.FC = () => {
  const navigate = useNavigate();
  const [grade, setGrade] = useState<string | null>(null);

  useEffect(() => {
    const selectedGrade = localStorage.getItem('selectedGrade');
    if (!selectedGrade) {
      navigate('/grades');
    } else {
      setGrade(selectedGrade);
    }
  }, [navigate]);

  const handleSubjectSelect = (subject: string) => {
    navigate(`/quiz?subject=${encodeURIComponent(subject)}&grade=${encodeURIComponent(grade || '')}`);
  };

  if (!grade) return null;

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/grades')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-4xl font-bold">{grade} Subjects</h2>
          <p className="text-white/60">Select a subject to start your practice session.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(SUBJECTS_BY_GRADE[grade] || []).map((subject, i) => (
          <motion.button
            key={subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleSubjectSelect(subject)}
            className="glass-card p-6 text-left group hover:bg-white/20 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/40 transition-colors">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <span className="font-bold text-lg">{subject}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
