import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { type PaymentConfirmation } from '../types';
import { Check, X, ExternalLink, Clock, User, AlertTriangle } from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
};

const Admin: React.FC = () => {
  const [user] = useAuthState(auth);
  const [payments, setPayments] = useState<PaymentConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.email === 'berekettesfaye137@gmail.com';

  useEffect(() => {
    const fetchPayments = async () => {
      if (!isAdmin) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'payments'),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentConfirmation));
        setPayments(data);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [isAdmin]);

  const handleApprove = async (payment: PaymentConfirmation) => {
    if (!payment.id || !payment.userId) return;
    setProcessingId(payment.id);
    setError(null);
    try {
      const { writeBatch, doc } = await import('firebase/firestore');
      const batch = writeBatch(db);

      // 1. Update payment status
      const paymentRef = doc(db, 'payments', payment.id);
      batch.update(paymentRef, { status: 'approved' });

      // 2. Update user subscription
      const userRef = doc(db, 'users', payment.userId);
      batch.set(userRef, { 
        subscriptionStatus: payment.plan,
        // Fallback fields in case the document is being created for the first time
        uid: payment.userId,
        email: payment.email || '',
        displayName: payment.name || 'User',
        createdAt: new Date().toISOString()
      }, { merge: true });

      // Commit the batch
      await batch.commit();

      // 3. Update local state
      setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: 'approved' } : p));
    } catch (err) {
      const detailedError = handleFirestoreError(err, OperationType.UPDATE, `payments/${payment.id} and users/${payment.userId}`);
      setError(detailedError.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (paymentId: string) => {
    setProcessingId(paymentId);
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'rejected'
      });
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p));
    } catch (err) {
      const detailedError = handleFirestoreError(err, OperationType.UPDATE, `payments/${paymentId}`);
      setError(detailedError.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAdmin && !loading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-2">Admin Panel</h2>
        <p className="text-white/50">Manage payment confirmations and user subscriptions.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-sm font-mono break-all">
          <div className="flex items-center gap-2 mb-2 font-bold">
            <AlertTriangle className="w-5 h-5" />
            Permission Error Detected
          </div>
          {error}
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary" />
          Pending Approvals
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="glass-card h-32 animate-pulse" />)}
          </div>
        ) : payments.length > 0 ? (
          <div className="grid gap-6">
            {payments.map((payment, i) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-6 flex flex-wrap items-center justify-between gap-6 ${
                  payment.status === 'approved' ? 'border-emerald-500/30 bg-emerald-500/5' :
                  payment.status === 'rejected' ? 'border-red-500/30 bg-red-500/5' : ''
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <img 
                      src={payment.cloudinaryImageUrl} 
                      alt="Receipt" 
                      className="w-24 h-24 object-cover rounded-xl cursor-zoom-in group-hover:opacity-80 transition-opacity"
                      onClick={() => window.open(payment.cloudinaryImageUrl, '_blank')}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-white/30" />
                      <span className="font-bold text-lg">{payment.name || 'Anonymous User'}</span>
                    </div>
                    <div className="text-sm text-white/50 mb-2">{payment.phone || payment.email || 'No contact info'}</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        payment.plan === 'premium' ? 'bg-secondary text-black' : 'bg-primary text-white'
                      }`}>
                        {payment.plan} Plan
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        payment.status === 'approved' ? 'bg-emerald-500 text-white' :
                        payment.status === 'rejected' ? 'bg-red-500 text-white' :
                        'bg-white/10 text-white/50'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>

                {payment.status === 'pending' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReject(payment.id!)}
                      disabled={processingId !== null}
                      className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      title="Reject"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleApprove(payment)}
                      disabled={processingId !== null}
                      className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                      title="Approve"
                    >
                      <Check className="w-6 h-6" />
                    </button>
                  </div>
                )}
                
                <div className="text-right text-xs text-white/30">
                  {new Date(payment.timestamp).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center text-white/30">
            <p>No payment confirmations found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
