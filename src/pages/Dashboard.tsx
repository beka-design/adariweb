import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'motion/react';
import { type QuizResult } from '../types';
import { BookOpen, Trophy, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [user] = useAuthState(auth);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      try {
        // Fetch user profile for subscription status
        const { getDoc, doc } = await import('firebase/firestore');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setSubscriptionStatus(userDoc.data().subscriptionStatus || 'free');
        }

        const q = query(
          collection(db, 'quizResults'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizResult));
        setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const averageScore = results.length > 0 
    ? Math.round((results.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / results.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
        <div>
          <h2 className="text-4xl font-bold mb-2">Welcome, {user?.displayName || 'Student'}</h2>
          <div className="flex items-center gap-3">
            <p className="text-white/50">Track your progress and keep improving your scores.</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              subscriptionStatus === 'premium' ? 'bg-secondary text-black' : 
              subscriptionStatus === 'basic' ? 'bg-primary text-white' : 
              'bg-white/10 text-white/50'
            }`}>
              {subscriptionStatus}
            </span>
            {user?.email === 'berekettesfaye137@gmail.com' && (
              <Link to="/admin" className="text-xs text-primary hover:underline font-bold uppercase tracking-wider">
                Admin Panel
              </Link>
            )}
          </div>
        </div>
        <Link to="/grades" className="glass-button-primary">
          New Practice Session
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-8 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="text-3xl font-bold">{results.length}</div>
            <div className="text-sm text-white/50">Quizzes Taken</div>
          </div>
        </div>
        
        <div className="glass-card p-8 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <div className="text-sm text-white/50">Average Accuracy</div>
          </div>
        </div>

        <div className="glass-card p-8 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <Clock className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <div className="text-3xl font-bold">{results[0] ? new Date(results[0].timestamp).toLocaleDateString() : 'N/A'}</div>
            <div className="text-sm text-white/50">Last Activity</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Recent Activity
          </h3>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="glass-card h-24 animate-pulse" />)}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 flex items-center justify-between hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white/30" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{result.subject}</div>
                      <div className="text-sm text-white/50">{result.grade} • {new Date(result.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{result.score}/{result.totalQuestions}</div>
                    <div className="text-xs text-white/30">Score</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-white/30">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No quiz results yet. Start practicing to see your progress!</p>
            </div>
          )}
        </div>

        {/* Upgrade Card */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Membership</h3>
          <div className="glass-card p-8 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
            <h4 className="text-xl font-bold mb-4">Premium Access</h4>
            <ul className="space-y-3 mb-8 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-secondary" />
                Unlimited practice questions
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-secondary" />
                Full mock entrance exams
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-secondary" />
                Detailed performance analytics
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-secondary" />
                Priority AI explanations
              </li>
            </ul>
            <Link to="/payment" className="glass-button-secondary w-full block text-center">
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
