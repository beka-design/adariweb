import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PAYMENT_INFO } from '../constants';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CreditCard, Smartphone, ShieldCheck, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

const Payment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('premium');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !auth.currentUser) return;

    setLoading(true);
    setError('');

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
      
      const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error('Cloudinary cloud name not configured');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();

      // 2. Save to Firestore
      await addDoc(collection(db, 'payments'), {
        userId: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        plan: selectedPlan,
        cloudinaryImageUrl: data.secure_url,
        status: 'pending',
        timestamp: new Date().toISOString()
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-12">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Payment Submitted!</h2>
          <p className="text-white/60 mb-8">
            Thank you for your payment. Our team will verify your screenshot and upgrade your account within 24 hours.
          </p>
          <button onClick={() => setSuccess(false)} className="glass-button-primary">
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Upgrade to Premium</h2>
        <p className="text-white/60">Unlock thousands of questions and detailed analytics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Plans & Info */}
        <div className="space-y-8">
          <div className="grid gap-4">
            {(['basic', 'premium'] as const).map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`glass-card p-6 text-left border-2 transition-all ${
                  selectedPlan === plan ? 'border-primary bg-primary/10' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-bold">{PAYMENT_INFO.plans[plan].name}</h4>
                  <div className="text-2xl font-bold text-primary">{PAYMENT_INFO.plans[plan].price}</div>
                </div>
                <p className="text-sm text-white/50">{PAYMENT_INFO.plans[plan].description}</p>
                {PAYMENT_INFO.plans[plan].groupPayment && (
                  <div className="mt-3 inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/30">
                    Share and pay together with 2 or 3 friends!
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="glass-card p-8 space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-secondary" />
              Payment Methods
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <Smartphone className="w-10 h-10 text-primary" />
                <div>
                  <div className="font-bold">Telebirr</div>
                  <div className="text-sm text-white/50">Account: {PAYMENT_INFO.telebirr.account}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <CreditCard className="w-10 h-10 text-primary" />
                <div>
                  <div className="font-bold">CBE (Commercial Bank)</div>
                  <div className="text-sm text-white/50">Account: {PAYMENT_INFO.cbe.account}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              <p className="text-xs text-white/70">
                Only upload a confirmation screenshot. No banking passwords or card details are required. Verification may take some time.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Upload Form */}
        <div className="glass-card p-8">
          <h4 className="text-2xl font-bold mb-8">Confirm Payment</h4>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Upload Screenshot</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  file ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 group-hover:border-primary/50 group-hover:bg-white/5'
                }`}>
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${file ? 'text-emerald-500' : 'text-white/20'}`} />
                  <p className="font-medium mb-1">{file ? file.name : 'Click or drag to upload'}</p>
                  <p className="text-xs text-white/30">JPG, PNG or WebP (Max 5MB)</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="glass-button-primary w-full py-4 text-lg"
            >
              {loading ? 'Processing...' : 'Submit Confirmation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
