import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserRole } from '../types';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        
        // Auto-upgrade role for admin emails on login if doc missing or role wrong
        const adminEmails = ['ehtisham@gmail.com', 'ehtishamarain567@gmail.com'];
        if (adminEmails.includes(email)) {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists() || userSnap.data()?.role !== UserRole.ADMIN) {
            await setDoc(userRef, {
              email,
              name: name || userSnap.data()?.name || 'Admin',
              role: UserRole.ADMIN,
              loyaltyPoints: userSnap.data()?.loyaltyPoints || 0,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
        }
        
        toast.success('Welcome back!');
        navigate('/');
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Check if this is the requested admin email
        const adminEmails = ['ehtisham@gmail.com', 'ehtishamarain567@gmail.com'];
        const role = adminEmails.includes(email) ? UserRole.ADMIN : UserRole.USER;
        
        await setDoc(doc(db, 'users', user.uid), {
          email,
          name,
          role,
          loyaltyPoints: 0,
          createdAt: new Date().toISOString(),
        });
        
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Account already exists! Switching to Sign In...');
        setIsLogin(true);
      } else if (isLogin && error.code === 'auth/invalid-credential' && ['ehtisham@gmail.com', 'ehtishamarain567@gmail.com'].includes(email)) {
        toast.error('Invalid password for Admin. If you forgot it, try a different email for now or SIGN UP if you haven\'t yet.');
      } else if (!isLogin && error.code === 'auth/email-already-in-use' && ['ehtisham@gmail.com', 'ehtishamarain567@gmail.com'].includes(email)) {
        toast.error('Admin account already exists. Please SIGN IN with your password.');
      } else {
        toast.error(error.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-[48px] shadow-2xl shadow-brand-900/5 p-10 md:p-14 border border-slate-100">
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200">
            <span className="text-white font-black text-3xl italic">S</span>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join ShopEasy'}
            </h2>
            <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">
              {isLogin ? 'Sign in to your account' : 'Start your fresh journey'}
            </p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-500 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="relative group">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 text-white rounded-2xl py-4.5 font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-200 hover:bg-brand-600 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-500 font-black hover:underline underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {(['ehtisham@gmail.com', 'ehtishamarain567@gmail.com'].includes(email)) && (
          <div className="mt-6 p-6 bg-brand-50 rounded-[32px] border-2 border-brand-200">
            <p className="text-xs text-brand-700 font-extrabold text-center leading-relaxed uppercase tracking-widest mb-4">
              Admin Email Detected <br/>
              {isLogin ? 'Login with your password' : 'Create your admin account'}
            </p>
            <p className="text-[10px] text-brand-600 font-bold text-center mb-4 leading-tight italic">
              Make sure you typed the email correctly (with the dot in .com)
            </p>
            {isLogin && (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setIsLogin(false)}
                  className="w-full py-3 bg-brand-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg"
                >
                  Go to Registration
                </button>
                <button 
                  onClick={handleResetPassword}
                  className="w-full py-3 bg-white text-brand-600 border-2 border-brand-200 rounded-2xl font-black text-[10px] uppercase tracking-wider"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
