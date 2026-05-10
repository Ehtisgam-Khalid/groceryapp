import { ShoppingCart, User, Search, Bell, Heart, LogOut, Menu, X, Award, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: authUser.uid, ...userDoc.data() } as UserProfile);
        }
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const handleLogout = () => signOut(auth);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-black/10 group-hover:rotate-6 transition-transform">
            S
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            Shop<span className="text-slate-400">Easy</span>
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-8">
          {[
            { label: 'Shop', path: '/' },
            { label: 'Membership', path: '/membership' },
            { label: 'Wishlist', path: '/wishlist' }
          ].map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${isActive(link.path) ? 'text-brand-600' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 py-2.5 w-[400px] focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-50 focus-within:border-brand-200 transition-all mx-4">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search products..." 
          className="bg-transparent border-none focus:ring-0 text-sm w-full ml-3 text-slate-700 font-bold placeholder:text-slate-300"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center gap-2 pr-4 border-r border-slate-100">
          <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
            <Bell size={20} />
          </button>
          <Link to="/cart" className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-brand-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-brand-200">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="relative group/user">
              <button className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-black/10">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{user.role}</p>
                  <p className="text-xs font-black text-slate-900 leading-none flex items-center gap-1">
                    {user.name || user.email.split('@')[0]}
                    <ChevronDown size={14} className="text-slate-400" />
                  </p>
                </div>
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden hidden group-hover/user:block z-50 animate-in fade-in zoom-in duration-200">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-all">
                  <User size={18} /> Profile
                </Link>
                {(user.role === UserRole.ADMIN || ['ehtisham@gmail.com', 'ehtishamarain567@gmail.com'].includes(user.email)) && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-all">
                    <Award size={18} /> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all border-t border-slate-50">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/auth" className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            Login
          </Link>
        )}

        <button className="xl:hidden p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-white border-b border-slate-100 md:hidden p-6 flex flex-col gap-4 shadow-2xl z-40"
          >
            <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-sm w-full ml-3 font-bold" />
            </div>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-brand-50 rounded-2xl text-brand-700 font-bold">
              <span className="flex items-center gap-3"><ShoppingCart size={20} /> My Bag</span>
              <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-black">{totalItems}</span>
            </Link>
            <Link to="/membership" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl uppercase tracking-widest text-xs">
              <Award size={20} /> Membership
            </Link>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl uppercase tracking-widest text-xs">
              <User size={20} /> Profile
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
