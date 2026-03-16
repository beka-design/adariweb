import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send } from 'lucide-react';

export const TelegramPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasJoined = localStorage.getItem('joined_telegram');
    if (!hasJoined) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoin = () => {
    localStorage.setItem('joined_telegram', 'true');
    window.open('https://t.me/adariexaminstitute', '_blank');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header with Background Pattern */}
            <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Send className="w-8 h-8 text-blue-500" />
              </div>
              <button 
                className="absolute top-4 right-4 p-2 text-white/40 cursor-not-allowed rounded-full transition-colors"
                disabled
              >
                {/* Close button removed to make joining mandatory */}
              </button>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Action Required
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To access the Adari Institute platform, please join our official Telegram channel for important updates and exam resources.
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                <p className="text-sm text-blue-700 font-medium">
                  Step 1: Click the button below to join.<br/>
                  Step 2: Return here to access the website.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleJoin}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Join Telegram Channel
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Adari Institute Community
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
