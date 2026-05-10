import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[60]">
      <div className="bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-full px-6 py-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <Link to="/" className="flex flex-col items-center gap-1 group">
          <div className={`p-2 rounded-2xl transition-all ${isActive('/') ? 'bg-brand-500 text-white' : 'text-slate-400'}`}>
            <Home size={22} />
          </div>
        </Link>
        <Link to="/search" className="flex flex-col items-center gap-1 group">
          <div className={`p-2 rounded-2xl transition-all ${isActive('/search') ? 'bg-brand-500 text-white' : 'text-slate-400'}`}>
            <Search size={22} />
          </div>
        </Link>
        <Link to="/cart" className="relative group">
          <div className={`p-3 rounded-full transition-all -mt-8 border-4 border-slate-50 ${isActive('/cart') ? 'bg-brand-500 text-white shadow-xl shadow-brand-200' : 'bg-slate-900 text-white shadow-xl shadow-black/20'}`}>
            <ShoppingBag size={24} />
          </div>
          {totalItems > 0 && (
            <span className="absolute -top-6 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {totalItems}
            </span>
          )}
        </Link>
        <Link to="/wishlist" className="flex flex-col items-center gap-1 group">
          <div className={`p-2 rounded-2xl transition-all ${isActive('/wishlist') ? 'bg-brand-500 text-white' : 'text-slate-400'}`}>
            <Heart size={22} />
          </div>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 group">
          <div className={`p-2 rounded-2xl transition-all ${isActive('/profile') ? 'bg-brand-500 text-white' : 'text-slate-400'}`}>
            <User size={22} />
          </div>
        </Link>
      </div>
    </div>
  );
}
