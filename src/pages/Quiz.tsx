import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { allQuestions } from '../data/questions';
import { type Question, type QuizResult, type UserProfile } from '../types';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { Timer, ArrowRight, CheckCircle2, XCircle, AlertCircle, Lock } from 'lucide-react';

const Quiz: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subject = searchParams.get('subject');
  const grade = searchParams.get('grade');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 hours in seconds
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) {
        setIsProfileLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Initialize quiz
  useEffect(() => {
    if (!subject || !grade || isProfileLoading) return;

    // Filter by grade and subject
    const normalizedGrade = grade.replace('Grade ', '');
    let filtered = allQuestions.filter(q => 
      q.subject === subject && 
      (q.grade === grade || q.grade === normalizedGrade)
    );
    
    // Filter by subscription status
    const isPremiumUser = userProfile?.subscriptionStatus === 'premium' || userProfile?.subscriptionStatus === 'basic';
    
    if (!isPremiumUser) {
      filtered = filtered.filter(q => !q.isPremium);
    }

    if (filtered.length === 0) {
      setQuestions([]);
      setUserAnswers([]);
    } else {
      const sorted = filtered.sort(() => Math.random() - 0.5);
      setQuestions(sorted);
      setUserAnswers(new Array(sorted.length).fill(null));
    }
  }, [subject, grade, navigate, userProfile, isProfileLoading]);

  const handleNext = useCallback(() => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = selectedOption;
    setUserAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedOption(updatedAnswers[nextIndex]);
    } else {
      finishQuiz(updatedAnswers);
    }
  }, [currentIndex, questions, selectedOption, userAnswers]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentIndex] = selectedOption;
      setUserAnswers(updatedAnswers);

      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedOption(updatedAnswers[prevIndex]);
    }
  }, [currentIndex, selectedOption, userAnswers]);

  // Timer logic
  useEffect(() => {
    if (isFinished || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          finishQuiz(userAnswers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, questions.length, userAnswers]);

  const finishQuiz = async (finalUserAnswers: (number | null)[]) => {
    if (isFinished) return;
    setIsFinished(true);

    const processedAnswers = questions.map((q, index) => {
      const userAnswer = finalUserAnswers[index];
      return {
        questionId: q.id,
        userAnswer: userAnswer ?? -1,
        isCorrect: userAnswer === q.correct
      };
    });

    const finalScore = processedAnswers.filter(a => a.isCorrect).length;
    
    if (auth.currentUser) {
      const result: QuizResult = {
        userId: auth.currentUser.uid,
        subject: subject!,
        grade: grade!,
        score: finalScore,
        totalQuestions: questions.length,
        timestamp: new Date().toISOString(),
        answers: processedAnswers
      };
      
      try {
        await addDoc(collection(db, 'quizResults'), result);
      } catch (err) {
        console.error('Error saving result:', err);
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-16 h-16 text-white/20 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No questions found</h2>
        <p className="text-white/50 mb-6">We're still adding questions for this subject.</p>
        <button onClick={() => navigate('/subjects')} className="glass-button-primary">
          Back to Subjects
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12"
        >
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-white/60 mb-8">Great job on finishing the {subject} practice.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="glass-card p-6 bg-white/5">
              <div className="text-4xl font-bold text-primary">{score}/{questions.length}</div>
              <div className="text-sm text-white/50">Total Score</div>
            </div>
            <div className="glass-card p-6 bg-white/5">
              <div className="text-4xl font-bold text-secondary">{Math.round((score / questions.length) * 100)}%</div>
              <div className="text-sm text-white/50">Accuracy</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="glass-button-primary px-8"
            >
              View Dashboard
            </button>
            <button 
              onClick={() => navigate('/subjects')}
              className="glass-button-outline px-8"
            >
              Try Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">{subject}</h2>
          <p className="text-white/50">{grade} • {currentQuestion.topicName}</p>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-6">
          <div className="flex items-center gap-2 text-secondary font-bold">
            <Timer className="w-5 h-5" />
            <span className={timeLeft < 60 ? 'text-red-500 animate-pulse' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="text-white/50 font-medium">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/10 rounded-full mb-12 overflow-hidden">
        <motion.div 
          className="h-full bg-primary shadow-[0_0_10px_rgba(0,102,255,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-8 md:p-12"
        >
          <h3 className="text-2xl font-medium mb-10 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="grid gap-4">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                className={`w-full p-5 rounded-2xl text-left transition-all flex items-center justify-between group ${
                  selectedOption === i 
                    ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-colors ${
                    selectedOption === i ? 'bg-primary text-white' : 'bg-white/10 text-white/50 group-hover:bg-white/20'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
                {selectedOption === i && (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="glass-button-outline px-10 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed order-2 sm:order-1"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="glass-button-primary px-10 flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
