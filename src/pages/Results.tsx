import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { type QuizResult, type Question } from '../types';
import { allQuestions } from '../data/questions';
import { CheckCircle2, XCircle, ArrowLeft, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const Results: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const getAIExplanation = async (question: Question) => {
    setGeneratingId(question.id);
    try {
      const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || (process as any).env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain why the correct answer to this question is "${question.options[question.correct]}". 
        Question: ${question.question}
        Options: ${question.options.join(', ')}
        Subject: ${question.subject}
        Grade: ${question.grade}
        Keep the explanation concise and suitable for a high school student.`,
      });
      
      if (response.text) {
        setAiExplanations(prev => ({ ...prev, [question.id]: response.text! }));
      }
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setGeneratingId(null);
    }
  };

  useEffect(() => {
    const fetchResult = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'quizResults', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResult(docSnap.data() as QuizResult);
        }
      } catch (err) {
        console.error('Error fetching result:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading results...</div>;
  if (!result) return <div className="text-center py-20">Result not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-bold">Review Answers</h2>
      </div>

      <div className="space-y-8">
        {result.answers.map((answer, i) => {
          const question = allQuestions.find(q => q.id === answer.questionId);
          if (!question) return null;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-8 border-l-4 ${answer.isCorrect ? 'border-emerald-500' : 'border-red-500'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <h3 className="text-xl font-medium leading-relaxed">{question.question}</h3>
                {answer.isCorrect ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                )}
              </div>

              <div className="grid gap-3 mb-8">
                {question.options.map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className={`p-4 rounded-xl flex items-center gap-4 ${
                      optIdx === question.correct
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-200'
                        : optIdx === answer.userAnswer
                        ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                        : 'bg-white/5 border border-white/10 opacity-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded flex items-center justify-center font-bold bg-black/20">
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span>{option}</span>
                  </div>
                ))}
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex gap-4">
                    <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-primary mb-1">Explanation</div>
                      <p className="text-white/70 leading-relaxed">{question.aiExplanation}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => getAIExplanation(question)}
                    disabled={generatingId === question.id}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-secondary/80 transition-colors disabled:opacity-50"
                  >
                    {generatingId === question.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Get Deep AI Help
                  </button>
                </div>

                <AnimatePresence>
                  {aiExplanations[question.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-primary/20"
                    >
                      <div className="flex gap-4">
                        <Sparkles className="w-5 h-5 text-secondary shrink-0 mt-1" />
                        <div className="text-sm text-white/80 italic leading-relaxed">
                          {aiExplanations[question.id]}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
