export interface Question {
  id: string;
  grade: string;
  subject: string;
  question: string;
  options: string[];
  correct: number; // Index of correct option
  aiExplanation: string;
  topicName: string;
  isPremium?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  grade?: string;
  subscriptionStatus: 'free' | 'basic' | 'premium';
  createdAt: string;
}

export interface QuizResult {
  id?: string;
  userId: string;
  subject: string;
  grade: string;
  score: number;
  totalQuestions: number;
  timestamp: string;
  answers: {
    questionId: string;
    userAnswer: number;
    isCorrect: boolean;
  }[];
}

export interface PaymentConfirmation {
  email: string;
  id?: string;
  userId: string;
  name: string;
  phone: string;
  plan: 'basic' | 'premium';
  cloudinaryImageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}
