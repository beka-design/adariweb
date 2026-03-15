import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LogOut, User, BookOpen, LayoutDashboard, CreditCard, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass-card m-4 px-6 py-4 flex items-center justify-between sticky top-4 z-50">
        <AnimatePresence>
          {showLogoutConfirm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
            >
              <div className="glass-card max-w-sm w-full p-6 text-center space-y-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Sign Out?</h3>
                  <p className="text-white/60">Are you sure you want to log out of your account?</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 glass-button-outline py-3"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Adari Institute
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          {user && (
            <>
              <Link to="/grades" className="hover:text-primary transition-colors">Practice</Link>
              <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/payment" className="hover:text-primary transition-colors">Upgrade</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="glass-button-primary py-2 px-4 text-sm">
              Login
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="glass-card m-4 p-8 text-center text-white/50 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
          <div>
            <h3 className="text-white font-bold mb-4">Adari Institute</h3>
            <p>Empowering Ethiopian students to succeed in their national exams through quality practice and insights.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <p>Email: info@adari.edu.et</p>
            <p>Phone: +251 901 705 907</p>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10">
          © {new Date().getFullYear()} Adari Institute. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
