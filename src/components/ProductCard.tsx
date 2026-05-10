import { Heart, Plus, Star, Zap } from 'lucide-react';
import React from 'react';
import { Product } from '../types';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToWishlist: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToWishlist }) => {
  const { addToCart } = useCart();
  const discount = product.discountedPrice 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-sleek group p-2 relative flex flex-col bg-white overflow-hidden"
    >
      <div className="relative h-64 rounded-[36px] overflow-hidden bg-slate-50 group-hover:shadow-2xl transition-all duration-500">
        <img 
          src={product.images[0] || `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600`} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-brand-950/0 group-hover:bg-brand-950/20 transition-all duration-500"></div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToWishlist(product); }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all border border-white/30"
        >
          <Heart size={18} className="transition-all" />
        </button>

        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-brand-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest shadow-xl shadow-brand-900/20">
            <Zap size={10} fill="currentColor" /> {discount}% OFF
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[9px] font-black text-brand-600 uppercase tracking-[0.2em]">{product.category}</div>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-brand-500 text-brand-500" />
            <span className="text-[10px] font-black text-slate-900">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-brand-600 transition-colors line-clamp-1 leading-tight tracking-tight">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            {product.discountedPrice && (
              <span className="text-[10px] text-slate-300 line-through font-black mb-0.5">${product.price.toFixed(2)}</span>
            )}
            <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
              ${(product.discountedPrice || product.price).toFixed(2)}
            </span>
          </div>

          <button 
            onClick={() => addToCart(product)}
            className="group/btn relative w-14 h-14"
          >
            <div className="absolute inset-0 bg-brand-600 rounded-2xl rotate-45 group-hover/btn:rotate-90 group-hover:bg-brand-500 transition-all duration-300"></div>
            <Plus size={24} strokeWidth={3} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
