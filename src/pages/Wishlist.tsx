import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Wishlist() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="pb-32 min-h-screen bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <Link to="/" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm hover:bg-slate-50 transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Favorites</h1>
              <p className="text-slate-400 font-medium text-sm mt-1">{wishlistItems.length} items saved for later</p>
            </div>
          </div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10">
            {wishlistItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-sm">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8 shadow-xl shadow-red-100/50"
            >
              <Heart size={40} fill="currentColor" />
            </motion.div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Your wishlist is empty</h2>
            <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto">Save items you love and they will appear here for easy access.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-bold text-sm shadow-2xl hover:bg-emerald-500 transition-all active:scale-95"
            >
              <ShoppingBag size={20} />
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
