import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // Automatically redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);
        if (result?.user) {
          navigate('/dashboard');
        }
      } catch (err: any) {
        if (err.code === 'auth/popup-blocked') {
          setError('Sign-in popup was blocked. Please allow popups for this site.');
        } else if (err.code === 'auth/unauthorized-domain') {
          setError('This domain is not authorized for Google Sign-in. Please add it to Firebase Console.');
        } else {
          setError(err.message || 'An error occurred during sign in.');
        }
      } finally {
        setLoading(false);
      }
    };
    handleRedirectResult();
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Trim accidental whitespace
    const cleanEmail = email.trim();
    
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      // Let the useEffect handle the navigation
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. If you registered with Google, use the Google button below.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please register.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(err.message || 'Failed to log in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      // First attempt: Popup (works on standard browsers, doesn't lose tracking cookies)
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      // If the browser explicitly blocked the popup, fallback to redirect
      if (err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr: any) {
           setError(redirectErr.message || 'Failed to initialize Google login redirect.');
           setLoading(false);
        }
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-in. Please add it to Firebase Console.');
        setLoading(false);
      } else {
        // Only set error if it wasn't a user cancellation
        if (err.code !== 'auth/popup-closed-by-user') {
          setError(err.message || 'Failed to initialize Google login.');
        }
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input pl-12"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pl-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? 'Logging in...' : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 text-white/30">
          <div className="h-px bg-white/10 flex-grow" />
          <span>OR</span>
          <div className="h-px bg-white/10 flex-grow" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="glass-button-outline w-full flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-white/50 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
